import Image from "next/image";
import { MOMO_POSTER_URL } from "./momoAvatar";

export function MomoAvatarPoster() {
	return (
		<Image
			src={MOMO_POSTER_URL}
			alt=""
			aria-hidden="true"
			unoptimized
			width={280}
			height={240}
			className="absolute inset-0 h-full w-full object-contain"
		/>
	);
}

MomoAvatarPoster.displayName = "MomoAvatarPoster";
