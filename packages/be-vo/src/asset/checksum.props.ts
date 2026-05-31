import type { ChecksumAlgorithm } from "./checksum-algorithm";

export interface ChecksumProps {
	algorithm: ChecksumAlgorithm;
	value: string;
}
