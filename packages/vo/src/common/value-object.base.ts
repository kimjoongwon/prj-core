/**
 * Value Object 추상 기본 클래스
 *
 * 특징:
 * 1. 불변성 (Immutability): 한 번 생성되면 변경 불가
 * 2. 값 동등성 (Value Equality): 내부 값으로 비교
 * 3. 자가 검증 (Self Validation): 생성 시 유효성 검증
 * 4. Side-effect Free: 부수효과 없음
 */
export abstract class ValueObject<T> {
	protected readonly props: T;

	constructor(props: T) {
		this.validate(props);
		this.props = Object.freeze(props); // 불변성 보장
	}

	/**
	 * 값 동등성 비교
	 */
	public equals(other?: ValueObject<T>): boolean {
		if (!other) return false;
		if (!(other instanceof ValueObject)) return false;

		return this.isEqual(this.props, other.props);
	}

	/**
	 * 하위 클래스에서 구현할 검증 로직
	 */
	protected abstract validate(props: T): void;

	/**
	 * 깊은 동등성 비교
	 */
	private isEqual(a: T, b: T): boolean {
		return JSON.stringify(a) === JSON.stringify(b);
	}

	/**
	 * 값 반환 (읽기 전용)
	 */
	public getValue(): Readonly<T> {
		return this.props;
	}
}
