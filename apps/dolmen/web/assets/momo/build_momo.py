"""고정 MOMO v3 사본에서 웹 자산을 재생성한다. 원본 blend는 저장하지 않는다."""

import hashlib
import json
import math
from pathlib import Path
import shutil
import subprocess

import bpy
from mathutils import Vector

ASSET_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = ASSET_DIR.parents[1] / "public" / "momo"
SOURCE_PATH = ASSET_DIR / "source" / "MOMO-hamster-v3.blend"
SOURCE_SHA256 = "7d31bcc8f74816def1bcf52694192695a0855b3b67e3ea05d1555403e7839640"
BUILD_DIR = ASSET_DIR / ".build"
STATES = (("idle", 1), ("hello", 97), ("listen", 193), ("think", 289),
          ("happy", 385), ("speak", 481))
LOOPS = {"idle", "listen", "think", "speak"}
BODY_TRIANGLE_LIMIT = 70_000
FUR_STRIDE = 20
CAMERA_POSITION = (0, 1.46, 6.0)
CAMERA_TARGET = (0, 1.46, 0)


def triangle_count(objects):
    total = 0
    for obj in objects:
        obj.data.calc_loop_triangles()
        total += len(obj.data.loop_triangles)
    return total


def sample_control_poses(scene, controls):
    poses = {}
    for name, start in STATES:
        frames = []
        for frame in range(start, start + 96):
            scene.frame_set(frame)
            frames.append({obj.name: tuple(tuple(part) for part in obj.matrix_basis.decompose())
                           for obj in controls})
        # 96 unique samples plus an explicit key at four seconds.
        frames.append(frames[0] if name in LOOPS else frames[-1])
        poses[name] = frames
    scene.frame_set(1)
    return poses


def fur_material(name, hex_color):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    color = [int(hex_color[index:index + 2], 16) / 255 for index in (0, 2, 4)]
    shader.inputs["Base Color"].default_value = tuple(
        channel / 12.92 if channel < .04045 else ((channel + .055) / 1.055) ** 2.4
        for channel in color) + (1,)
    shader.inputs["Roughness"].default_value = .88
    return material


def strand_midpoint(points, radii):
    lengths = [(points[index + 1] - points[index]).length for index in range(3)]
    remaining = sum(lengths) / 2
    for index, length in enumerate(lengths):
        if remaining <= length or index == 2:
            fraction = remaining / max(length, 1e-12)
            return points[index].lerp(points[index + 1], fraction), (
                radii[index] * (1 - fraction) + radii[index + 1] * fraction)
        remaining -= length
    raise RuntimeError("가닥의 중간점을 찾지 못했습니다")


def strand_ring(center, tangent, radius):
    tangent = tangent.normalized()
    reference = Vector((0, 0, 1)) if abs(tangent.z) < .9 else Vector((1, 0, 0))
    side = tangent.cross(reference).normalized()
    other = tangent.cross(side).normalized()
    return [tuple(center + radius * (side * math.cos(angle) + other * math.sin(angle)))
            for angle in (0, math.tau / 3, 2 * math.tau / 3)]


def replace_native_fur(hair_objects):
    materials = {
        "biscuit": fur_material("MOMO fur · biscuit PBR", "D1A46C"),
        "vanilla": fur_material("MOMO fur · vanilla PBR", "EFE2CB"),
        "peach": fur_material("MOMO fur · peach PBR", "EDB7AA"),
    }
    fur_objects = []
    selected_count = 0
    for hair in hair_objects:
        vertices, faces = [], []
        for strand in list(hair.data.curves)[::FUR_STRIDE]:
            points = [point.position.copy() for point in strand.points]
            if len(points) != 4:
                raise RuntimeError("원본 털은 가닥당 4점이어야 합니다")
            offset = strand.first_point_index
            radii = [hair.data.attributes["radius"].data[offset + index].value for index in range(4)]
            midpoint, middle_radius = strand_midpoint(points, radii)
            base = len(vertices)
            vertices.extend(strand_ring(points[0], midpoint - points[0], radii[0]))
            vertices.extend(strand_ring(midpoint, points[-1] - midpoint, middle_radius))
            vertices.append(tuple(points[-1]))
            faces.append((base + 2, base + 1, base))
            for side in range(3):
                following = (side + 1) % 3
                faces.extend(((base + side, base + following, base + 3 + following),
                              (base + side, base + 3 + following, base + 3 + side),
                              (base + 3 + side, base + 3 + following, base + 6)))
            selected_count += 1
        mesh = bpy.data.meshes.new("Web " + hair.data.name)
        mesh.from_pydata(vertices, [], faces)
        mesh.update()
        obj = bpy.data.objects.new("Fur · " + hair.name, mesh)
        bpy.context.scene.collection.objects.link(obj)
        obj.parent = hair.parent
        obj.matrix_parent_inverse = hair.matrix_parent_inverse.copy()
        obj.matrix_basis = hair.matrix_basis.copy()
        source_material = hair.data.materials[0].name
        key = "vanilla" if "vanilla" in source_material else "peach" if "peach" in source_material else "biscuit"
        mesh.materials.append(materials[key])
        for polygon in mesh.polygons:
            polygon.use_smooth = True
        fur_objects.append(obj)
        bpy.data.objects.remove(hair, do_unlink=True)
    if selected_count != 6825:
        raise RuntimeError(f"샘플링 결과가 6825가 아닙니다: {selected_count}")
    return fur_objects, selected_count


def finalize_body_meshes(scene):
    original_objects = sorted([obj for obj in scene.objects if obj.type in {"MESH", "CURVE"}],
                              key=lambda obj: obj.name)
    body_objects = []
    depsgraph = bpy.context.evaluated_depsgraph_get()
    for obj in original_objects:
        evaluated = obj.evaluated_get(depsgraph)
        mesh = bpy.data.meshes.new_from_object(evaluated, depsgraph=depsgraph)
        if obj.type == "CURVE":
            replacement = bpy.data.objects.new(obj.name + " · web", mesh)
            scene.collection.objects.link(replacement)
            replacement.parent = obj.parent
            replacement.matrix_parent_inverse = obj.matrix_parent_inverse.copy()
            replacement.matrix_basis = obj.matrix_basis.copy()
            bpy.data.objects.remove(obj, do_unlink=True)
            body_objects.append(replacement)
        else:
            obj.modifiers.clear()
            obj.data = mesh
            body_objects.append(obj)
    original_count = triangle_count(body_objects)
    protected, candidates = [], []
    for obj in body_objects:
        obj.data.calc_loop_triangles()
        (protected if len(obj.data.loop_triangles) <= 700 or obj.name.startswith("Eye.")
         else candidates).append(obj)
    protected_count = triangle_count(protected)
    candidate_count = triangle_count(candidates)
    ratio = min(1.0, (BODY_TRIANGLE_LIMIT - protected_count) / max(candidate_count, 1))
    modifiers = []
    for obj in candidates:
        modifier = obj.modifiers.new("MOMO web triangle budget", "DECIMATE")
        modifier.decimate_type = "COLLAPSE"
        modifier.use_collapse_triangulate = True
        modifiers.append(modifier)
    for _ in range(6):
        for modifier in modifiers:
            modifier.ratio = ratio
        depsgraph.update()
        evaluated_count = 0
        for obj in body_objects:
            temporary = obj.evaluated_get(depsgraph).to_mesh()
            temporary.calc_loop_triangles()
            evaluated_count += len(temporary.loop_triangles)
            obj.evaluated_get(depsgraph).to_mesh_clear()
        if evaluated_count <= BODY_TRIANGLE_LIMIT:
            break
        ratio *= (BODY_TRIANGLE_LIMIT - protected_count) / max(evaluated_count - protected_count, 1) * .995
    for obj in candidates:
        evaluated = obj.evaluated_get(depsgraph)
        obj.data = bpy.data.meshes.new_from_object(evaluated, depsgraph=depsgraph)
        obj.modifiers.clear()
    for obj in body_objects:
        for layer in list(obj.data.uv_layers):
            obj.data.uv_layers.remove(layer)
    final_count = triangle_count(body_objects)
    if final_count > BODY_TRIANGLE_LIMIT:
        raise RuntimeError(f"본체 삼각형 예산 초과: {final_count}")
    return body_objects, original_count, final_count


def bake_named_clips(scene, controls, poses):
    for obj in controls:
        obj.animation_data_clear()
        obj.rotation_mode = "QUATERNION"
        obj.animation_data_create()
        for name, _ in STATES:
            action = bpy.data.actions.new(f"MOMO {name} · {obj.name}")
            slot = action.slots.new(obj.id_type, obj.name)
            obj.animation_data.action = action
            obj.animation_data.action_slot = slot
            for frame, control_poses in enumerate(poses[name], start=1):
                location, rotation, scale = control_poses[obj.name]
                obj.location, obj.rotation_quaternion, obj.scale = location, rotation, scale
                for path in ("location", "rotation_quaternion", "scale"):
                    obj.keyframe_insert(path, frame=frame)
            for layer in action.layers:
                for strip in layer.strips:
                    for bag in strip.channelbags:
                        for curve in bag.fcurves:
                            for key in curve.keyframe_points:
                                key.interpolation = "LINEAR"
            track = obj.animation_data.nla_tracks.new()
            track.name = name
            strip = track.strips.new(name, 1, action)
            strip.action_slot = slot
            strip.action_frame_start, strip.action_frame_end = 1, 97
            strip.frame_start, strip.frame_end = 1, 97
            strip.blend_type, strip.extrapolation = "REPLACE", "NOTHING"
            track.mute = name != "idle"
            obj.animation_data.action = None
    scene.frame_start, scene.frame_end, scene.render.fps = 1, 97, 24
    scene.frame_set(1)


def select_state(scene, controls, name, frame=1):
    for obj in controls:
        for track in obj.animation_data.nla_tracks:
            track.mute = track.name != name
    scene.frame_set(frame)


def animation_bounds(scene, controls, meshes):
    minimum, maximum = Vector((math.inf,) * 3), Vector((-math.inf,) * 3)
    for name, _ in STATES:
        select_state(scene, controls, name)
        for frame in range(1, 98):
            scene.frame_set(frame)
            for obj in meshes:
                for corner in obj.bound_box:
                    point = obj.matrix_world @ Vector(corner)
                    # glTF Y-up: Blender (x, y, z) becomes (x, z, -y).
                    point = Vector((point.x, point.z, -point.y))
                    for axis in range(3):
                        minimum[axis] = min(minimum[axis], point[axis])
                        maximum[axis] = max(maximum[axis], point[axis])
    select_state(scene, controls, "idle")
    return {"min": list(minimum), "max": list(maximum),
            "center": list((minimum + maximum) / 2), "size": list(maximum - minimum)}


def render_poster(scene):
    camera_data = bpy.data.cameras.new("MOMO poster camera")
    camera = bpy.data.objects.new("MOMO poster camera", camera_data)
    scene.collection.objects.link(camera)
    # glTF (x, y, z) -> Blender (x, -z, y).
    camera.location = (CAMERA_POSITION[0], -CAMERA_POSITION[2], CAMERA_POSITION[1])
    target = Vector((CAMERA_TARGET[0], -CAMERA_TARGET[2], CAMERA_TARGET[1]))
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera_data.type = "PERSP"
    camera_data.angle = math.radians(32)
    scene.camera = camera
    for name, location, energy, size in (
        ("Key", (3, -4, 6), 550, 4), ("Fill", (-4, -2, 3), 350, 5),
        ("Rim", (0, 3, 5), 450, 3)):
        light_data = bpy.data.lights.new("MOMO " + name, "AREA")
        light_data.energy, light_data.shape, light_data.size = energy, "DISK", size
        light = bpy.data.objects.new("MOMO " + name, light_data)
        scene.collection.objects.link(light)
        light.location = location
        light.rotation_euler = (Vector((0, 0, 1.3)) - light.location).to_track_quat("-Z", "Y").to_euler()
    scene.world.use_nodes = True
    scene.world.node_tree.nodes.get("Background").inputs["Color"].default_value = (.5, .5, .5, 1)
    scene.world.node_tree.nodes.get("Background").inputs["Strength"].default_value = .5
    scene.render.engine = "CYCLES"
    scene.cycles.device, scene.cycles.samples, scene.cycles.use_denoising = "CPU", 32, True
    scene.render.resolution_x = scene.render.resolution_y = 560
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.filepath = str(BUILD_DIR / "poster.png")
    bpy.ops.render.render(write_still=True)
    cwebp = shutil.which("cwebp")
    if not cwebp:
        raise RuntimeError("poster.webp 생성에 cwebp가 필요합니다")
    subprocess.run([cwebp, "-quiet", "-q", "90", "-alpha_q", "100",
                    scene.render.filepath, "-o", str(PUBLIC_DIR / "poster.webp")], check=True)


def main():
    if bpy.app.version_string != "5.2.2 LTS":
        raise RuntimeError(f"고정 Blender 버전이 아닙니다: {bpy.app.version_string}")
    source_sha256 = hashlib.sha256(SOURCE_PATH.read_bytes()).hexdigest()
    if source_sha256 != SOURCE_SHA256:
        raise RuntimeError(f"승인된 v3 원본 SHA와 다릅니다: {source_sha256}")
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    BUILD_DIR.mkdir(exist_ok=True)
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE_PATH))
    scene = bpy.context.scene
    controls = sorted([obj for obj in scene.objects if obj.type == "EMPTY"], key=lambda obj: obj.name)
    native_hair = sorted([obj for obj in scene.objects if obj.type == "CURVES"], key=lambda obj: obj.name)
    source_strands = sum(len(obj.data.curves) for obj in native_hair)
    if len(controls) != 10 or len(native_hair) != 19 or source_strands != 136500:
        raise RuntimeError("고정 v3 모델의 제어점/털 구조와 다릅니다")
    poses = sample_control_poses(scene, controls)
    for obj in list(scene.objects):
        if obj.type in {"CAMERA", "LIGHT"} or obj.name.startswith("Studio ·"):
            bpy.data.objects.remove(obj, do_unlink=True)
    body_objects, original_body_count, body_count = finalize_body_meshes(scene)
    fur_objects, sampled_strands = replace_native_fur(native_hair)
    bake_named_clips(scene, controls, poses)
    meshes = body_objects + fur_objects
    bounds = animation_bounds(scene, controls, meshes)
    bpy.ops.object.select_all(action="DESELECT")
    for obj in meshes + controls:
        obj.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=str(PUBLIC_DIR / "momo.glb"), export_format="GLB", use_selection=True,
        export_animations=True, export_animation_mode="NLA_TRACKS", export_merge_animation="NLA_TRACK",
        export_anim_slide_to_zero=True, export_frame_range=False, export_force_sampling=True,
        export_optimize_animation_size=True, export_optimize_animation_keep_anim_object=True,
        export_sampling_interpolation_fallback="LINEAR", export_apply=False,
        export_texcoords=False, export_tangents=False, export_extras=False,
        export_cameras=False, export_lights=False, export_yup=True,
    )
    report = {
        "blender": bpy.app.version_string,
        "source_sha256": source_sha256,
        "source_fur_strands": source_strands, "sampled_fur_strands": sampled_strands,
        "fur_stride": FUR_STRIDE, "fur_triangles": triangle_count(fur_objects),
        "body_triangles_before_decimate": original_body_count, "body_triangles": body_count,
        "total_triangles": triangle_count(meshes), "bounds_gltf_animation_union": bounds,
        "camera_gltf": {"position": list(CAMERA_POSITION), "target": list(CAMERA_TARGET), "fov_degrees": 32},
        "clips": {name: {"duration_seconds": 4, "loop": name in LOOPS,
                         "source_frames_inclusive": [start, start + 95]} for name, start in STATES},
        "origin": "native master origin; glTF Y-up; front +Z",
        "source_saved": False,
    }
    (ASSET_DIR / "export-report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    render_poster(scene)
    print("MOMO_EXPORT_DONE", json.dumps(report, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
