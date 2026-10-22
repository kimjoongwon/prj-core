"""표준 Python만 사용하여 배포 GLB의 구조·예산·클립 경계를 독립 검증한다."""

import hashlib
import json
import math
from pathlib import Path
import struct

ASSET_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = ASSET_DIR.parents[1] / "public" / "momo"
EXPECTED_CLIPS = {"idle", "hello", "listen", "think", "happy", "speak"}
LOOP_CLIPS = {"idle", "listen", "think", "speak"}
COMPONENT_FORMATS = {5120: "b", 5121: "B", 5122: "h", 5123: "H", 5125: "I", 5126: "f"}
ACCESSOR_WIDTHS = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT4": 16}


def read_glb(path):
    raw = path.read_bytes()
    magic, version, length = struct.unpack_from("<4sII", raw)
    assert magic == b"glTF" and version == 2 and length == len(raw), "GLB 헤더 오류"
    chunks = {}
    offset = 12
    while offset < length:
        chunk_length, chunk_type = struct.unpack_from("<II", raw, offset)
        chunks[chunk_type] = raw[offset + 8:offset + 8 + chunk_length]
        offset += 8 + chunk_length
    assert offset == length and 0x4E4F534A in chunks and 0x004E4942 in chunks, "GLB 청크 오류"
    return json.loads(chunks[0x4E4F534A]), chunks[0x004E4942], raw


def read_accessor(gltf, binary, index):
    accessor = gltf["accessors"][index]
    assert "sparse" not in accessor, "예상하지 않은 sparse accessor"
    view = gltf["bufferViews"][accessor["bufferView"]]
    width = ACCESSOR_WIDTHS[accessor["type"]]
    component = COMPONENT_FORMATS[accessor["componentType"]]
    element = struct.Struct("<" + component * width)
    stride = view.get("byteStride", element.size)
    offset = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    assert offset + (accessor["count"] - 1) * stride + element.size <= len(binary), "accessor 범위 오류"
    return [element.unpack_from(binary, offset + row * stride) for row in range(accessor["count"])]


def webp_size(path):
    raw = path.read_bytes()
    assert raw[:4] == b"RIFF" and raw[8:12] == b"WEBP", "WebP 헤더 오류"
    offset = 12
    while offset + 8 <= len(raw):
        kind, length = raw[offset:offset + 4], struct.unpack_from("<I", raw, offset + 4)[0]
        payload = raw[offset + 8:offset + 8 + length]
        if kind == b"VP8X":
            return (1 + int.from_bytes(payload[4:7], "little"),
                    1 + int.from_bytes(payload[7:10], "little"))
        if kind == b"VP8 ":
            assert payload[3:6] == b"\x9d\x01\x2a", "VP8 프레임 오류"
            return tuple(dimension & 0x3FFF for dimension in struct.unpack_from("<HH", payload, 6))
        offset += 8 + length + length % 2
    raise AssertionError("WebP 크기를 찾지 못했습니다")


def verify():
    gltf, binary, raw = read_glb(PUBLIC_DIR / "momo.glb")
    assert len(raw) <= 5 * 1024 * 1024, f"GLB 5 MiB 초과: {len(raw)}"
    assert not gltf.get("images") and not gltf.get("textures"), "현재 자산은 외부/내장 텍스처를 사용하지 않습니다"
    assert all("uri" not in buffer for buffer in gltf["buffers"]), "외부 버퍼 참조 발견"
    assert all(material.get("alphaMode", "OPAQUE") == "OPAQUE"
               for material in gltf.get("materials", [])), "불투명 재질 계약 위반"
    nodes = gltf["nodes"]
    assert not any("camera" in node or node.get("name", "").startswith("Studio ·") for node in nodes), "Studio/카메라 포함"
    assert not gltf.get("cameras") and not gltf.get("skins"), "예상하지 않은 카메라/스킨"
    fur_triangles = body_triangles = 0
    fur_nodes = []
    position_count = 0
    for node in nodes:
        if "mesh" not in node:
            continue
        mesh = gltf["meshes"][node["mesh"]]
        is_fur = node.get("name", "").startswith("Fur · ")
        if is_fur:
            fur_nodes.append(node["name"])
        for primitive in mesh["primitives"]:
            assert primitive.get("mode", 4) == 4, "삼각형 이외의 primitive"
            positions = read_accessor(gltf, binary, primitive["attributes"]["POSITION"])
            position_count += len(positions)
            assert all(math.isfinite(component) for point in positions for component in point), "비정상 좌표"
            normals = read_accessor(gltf, binary, primitive["attributes"]["NORMAL"])
            assert len(normals) == len(positions), "법선 개수 불일치"
            assert all(math.isfinite(component) for normal in normals for component in normal), "비정상 법선"
            indices = read_accessor(gltf, binary, primitive["indices"])
            assert len(indices) % 3 == 0 and all(0 <= index[0] < len(positions) for index in indices), "인덱스 오류"
            if is_fur:
                fur_triangles += len(indices) // 3
            else:
                body_triangles += len(indices) // 3
    assert len(fur_nodes) == 19, f"털 파트 개수 오류: {len(fur_nodes)}"
    assert fur_triangles == 68_250, f"털 6825가닥/68250삼각형 계약 위반: {fur_triangles}"
    assert body_triangles <= 70_000, f"본체 예산 초과: {body_triangles}"
    assert body_triangles + fur_triangles <= 150_000, "전체 삼각형 예산 초과"
    animations = gltf["animations"]
    assert len(animations) == 6 and {animation["name"] for animation in animations} == EXPECTED_CLIPS, "clip 이름/개수 오류"
    control_names = {"Badge · assembly", "CTRL · Blink.L", "CTRL · Blink.R", "CTRL · Head",
                     "CTRL · Elbow.L", "CTRL · Paw.L", "CTRL · Elbow.R", "CTRL · Paw.R",
                     "CTRL · Breathing", "CTRL · Master"}
    controls = {index for index, node in enumerate(nodes) if node.get("name") in control_names}
    assert len(controls) == 10, f"Empty 제어 노드 개수 오류: {len(controls)}"
    clip_reports = {}
    for animation in animations:
        targets, maximum_loop_error = set(), 0.0
        for channel in animation["channels"]:
            target = channel["target"]
            targets.add((target["node"], target["path"]))
            sampler = animation["samplers"][channel["sampler"]]
            times = [row[0] for row in read_accessor(gltf, binary, sampler["input"])]
            assert abs(times[0]) < 1e-6 and abs(times[-1] - 4) < 1e-6, f"{animation['name']} 시간 경계 오류: {times[0]}, {times[-1]}"
            assert all(a < b for a, b in zip(times, times[1:])), "키 시간이 단조 증가하지 않습니다"
            interpolation = sampler.get("interpolation", "LINEAR")
            assert interpolation in {"LINEAR", "STEP"}, "보간 계약 오류"
            samples = read_accessor(gltf, binary, sampler["output"])
            assert len(samples) == len(times), "애니메이션 샘플 개수 오류"
            assert all(math.isfinite(component) for sample in samples for component in sample), "비정상 애니메이션 값"
            if interpolation == "STEP":
                # Blender는 상수 TRS 채널을 두 개의 STEP 키로 최적화한다.
                assert all(max(abs(a - b) for a, b in zip(samples[0], sample)) <= 1e-6
                           for sample in samples), "변하는 채널의 STEP 보간 발견"
            first, last = samples[0], samples[-1]
            error = max(abs(a - b) for a, b in zip(first, last))
            if target["path"] == "rotation":
                error = min(error, max(abs(a + b) for a, b in zip(first, last)))
            maximum_loop_error = max(maximum_loop_error, error)
            if animation["name"] in LOOP_CLIPS:
                assert error <= 1e-5, f"{animation['name']} loop 경계 불일치: {error}"
        expected_targets = {(control, path) for control in controls
                            for path in ("translation", "rotation", "scale")}
        assert targets == expected_targets, f"{animation['name']} 제어 채널 누락"
        clip_reports[animation["name"]] = {"duration_seconds": 4, "channels": len(targets),
                                            "loop": animation["name"] in LOOP_CLIPS,
                                            "maximum_endpoint_error": maximum_loop_error}
    export_report = json.loads((ASSET_DIR / "export-report.json").read_text())
    assert export_report["source_sha256"] == hashlib.sha256(
        (ASSET_DIR / "source" / "MOMO-hamster-v3.blend").read_bytes()).hexdigest(), "원본 SHA 불일치"
    assert export_report["body_triangles"] == body_triangles, "원본 보고서/GLB 본체 개수 불일치"
    assert export_report["total_triangles"] == body_triangles + fur_triangles, "원본 보고서/GLB 전체 개수 불일치"
    poster_dimensions = webp_size(PUBLIC_DIR / "poster.webp")
    assert poster_dimensions == (560, 560), f"포스터 크기 오류: {poster_dimensions}"
    report = {"status": "passed", "glb_bytes": len(raw), "glb_mib": len(raw) / 1024 ** 2,
              "glb_sha256": hashlib.sha256(raw).hexdigest(), "body_triangles": body_triangles,
              "fur_triangles": fur_triangles, "total_triangles": body_triangles + fur_triangles,
              "exported_positions": position_count, "fur_parts": len(fur_nodes),
              "clips": clip_reports, "poster_dimensions": list(poster_dimensions),
              "poster_bytes": (PUBLIC_DIR / "poster.webp").stat().st_size,
              "browser_fps": "별도 브라우저 검증 필요"}
    (ASSET_DIR / "validation-report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    verify()
