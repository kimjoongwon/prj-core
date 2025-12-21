import SafeApiKit from "@safe-global/api-kit";
import Safe, { SafeAccountConfig } from "@safe-global/protocol-kit";
import { SAFE_CONFIG, SAFE_TX_SERVICE_URL } from "@/config/web3.config";
import type { SafeInfo } from "@/stores";

// Safe SDK Provider 타입
type SafeProvider = Parameters<typeof Safe.init>[0]["provider"];

/**
 * Safe 서비스
 * Safe SDK를 래핑하여 Safe 생성, 조회, 트랜잭션 관리 기능 제공
 */
export class SafeService {
  private protocolKit: Safe | null = null;
  private apiKit: SafeApiKit | null = null;
  private chainId: number;

  constructor(chainId: number = 1) {
    this.chainId = chainId;
  }

  /**
   * API Kit 초기화
   */
  private getApiKit(): SafeApiKit {
    if (!this.apiKit) {
      const txServiceUrl = SAFE_TX_SERVICE_URL[this.chainId];
      if (!txServiceUrl) {
        throw new Error(`Unsupported chain ID: ${this.chainId}`);
      }
      this.apiKit = new SafeApiKit({
        chainId: BigInt(this.chainId),
      });
    }
    return this.apiKit;
  }

  /**
   * 새 Safe 생성
   * @param owners 소유자 주소 배열 (3명)
   * @param threshold 필요 서명 수 (3)
   * @param signer 서명자 (EIP-1193 Provider)
   */
  async createSafe(
    owners: string[],
    threshold: number = SAFE_CONFIG.threshold,
    provider: SafeProvider
  ): Promise<string> {
    // 소유자 수 검증
    if (owners.length !== SAFE_CONFIG.ownerCount) {
      throw new Error(`소유자는 ${SAFE_CONFIG.ownerCount}명이어야 합니다.`);
    }

    // threshold 검증
    if (threshold > owners.length) {
      throw new Error("Threshold는 소유자 수보다 클 수 없습니다.");
    }

    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
    };

    // Safe 배포를 위한 예측 주소 계산
    const protocolKit = await Safe.init({
      provider,
      predictedSafe: {
        safeAccountConfig,
      },
    });

    // Safe 배포
    const deploymentTransaction =
      await protocolKit.createSafeDeploymentTransaction();

    // 트랜잭션 실행
    const client = await protocolKit.getSafeProvider().getExternalSigner();
    if (!client) {
      throw new Error("Signer not found");
    }

    await client.sendTransaction({
      to: deploymentTransaction.to as `0x${string}`,
      value: BigInt(deploymentTransaction.value),
      data: deploymentTransaction.data as `0x${string}`,
      chain: null,
    });

    // Safe 주소 반환
    const safeAddress = await protocolKit.getAddress();
    return safeAddress;
  }

  /**
   * 기존 Safe 연결
   * @param safeAddress Safe 주소
   * @param provider EIP-1193 Provider
   */
  async connectToSafe(
    safeAddress: string,
    provider: SafeProvider
  ): Promise<Safe> {
    this.protocolKit = await Safe.init({
      provider,
      safeAddress,
    });
    return this.protocolKit;
  }

  /**
   * Safe 정보 조회
   * @param safeAddress Safe 주소
   * @param provider EIP-1193 Provider
   */
  async getSafeInfo(
    safeAddress: string,
    provider: SafeProvider
  ): Promise<SafeInfo> {
    const safe = await this.connectToSafe(safeAddress, provider);

    const [owners, threshold, nonce] = await Promise.all([
      safe.getOwners(),
      safe.getThreshold(),
      safe.getNonce(),
    ]);

    return {
      address: safeAddress,
      chainId: this.chainId,
      owners,
      threshold,
      nonce,
    };
  }

  /**
   * Safe ETH 잔액 조회
   * @param safeAddress Safe 주소
   * @param provider EIP-1193 Provider
   */
  async getEthBalance(
    safeAddress: string,
    provider: SafeProvider
  ): Promise<string> {
    const safe = await this.connectToSafe(safeAddress, provider);
    const balance = await safe.getBalance();
    return balance.toString();
  }

  /**
   * 사용자의 Safe 목록 조회
   * @param ownerAddress 소유자 주소
   */
  async getSafesByOwner(ownerAddress: string): Promise<string[]> {
    const apiKit = this.getApiKit();
    const response = await apiKit.getSafesByOwner(ownerAddress);
    return response.safes;
  }

  /**
   * Protocol Kit 반환
   */
  getProtocolKit(): Safe | null {
    return this.protocolKit;
  }
}

// 싱글톤 인스턴스
export const safeService = new SafeService();
