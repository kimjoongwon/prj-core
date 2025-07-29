import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoggerUtil } from "../LoggerUtil";

describe("LoggerUtil", () => {
  // console 메서드들을 모킹
  const consoleSpy = {
    log: vi.spyOn(console, "log"),
    warn: vi.spyOn(console, "warn"),
    error: vi.spyOn(console, "error"),
    debug: vi.spyOn(console, "debug"),
  };

  beforeEach(() => {
    // 각 테스트 전에 스파이를 리셋
    Object.values(consoleSpy).forEach((spy) => spy.mockClear());
  });

  afterEach(() => {
    // 테스트 후 정리
    vi.clearAllMocks();
  });

  describe("인스턴스 메서드", () => {
    it("create 메서드로 logger 인스턴스를 생성할 수 있다", () => {
      const logger = LoggerUtil.create("[TestComponent]");
      expect(logger).toBeInstanceOf(LoggerUtil);
    });

    it("info 메서드가 올바른 형식으로 로그를 출력한다", () => {
      const logger = LoggerUtil.create("[TestComponent]");
      const testData = { key: "value" };

      logger.info("테스트 메시지", testData);

      expect(consoleSpy.log).toHaveBeenCalledWith("🔍 [TestComponent] 테스트 메시지", testData);
    });

    it("success 메서드가 올바른 형식으로 로그를 출력한다", () => {
      const logger = LoggerUtil.create("[TestComponent]");

      logger.success("성공 메시지");

      expect(consoleSpy.log).toHaveBeenCalledWith("✅ [TestComponent] 성공 메시지", "");
    });

    it("warning 메서드가 올바른 형식으로 로그를 출력한다", () => {
      const logger = LoggerUtil.create("[TestComponent]");

      logger.warning("경고 메시지");

      expect(consoleSpy.warn).toHaveBeenCalledWith("⚠️ [TestComponent] 경고 메시지", "");
    });

    it("error 메서드가 올바른 형식으로 로그를 출력한다", () => {
      const logger = LoggerUtil.create("[TestComponent]");
      const errorData = { error: "test error" };

      logger.error("에러 메시지", errorData);

      expect(consoleSpy.error).toHaveBeenCalledWith("❌ [TestComponent] 에러 메시지", errorData);
    });

    it("debug 메서드가 올바른 형식으로 로그를 출력한다", () => {
      const logger = LoggerUtil.create("[TestComponent]");

      logger.debug("디버그 메시지");

      expect(consoleSpy.debug).toHaveBeenCalledWith("🐛 [TestComponent] 디버그 메시지", "");
    });
  });

  describe("정적 메서드", () => {
    it("정적 info 메서드가 prefix 없이 로그를 출력한다", () => {
      const testData = { key: "value" };

      LoggerUtil.info("정적 정보 메시지", testData);

      expect(consoleSpy.log).toHaveBeenCalledWith("🔍 정적 정보 메시지", testData);
    });

    it("정적 success 메서드가 prefix 없이 로그를 출력한다", () => {
      LoggerUtil.success("정적 성공 메시지");

      expect(consoleSpy.log).toHaveBeenCalledWith("✅ 정적 성공 메시지", "");
    });

    it("정적 warning 메서드가 prefix 없이 로그를 출력한다", () => {
      LoggerUtil.warning("정적 경고 메시지");

      expect(consoleSpy.warn).toHaveBeenCalledWith("⚠️ 정적 경고 메시지", "");
    });

    it("정적 error 메서드가 prefix 없이 로그를 출력한다", () => {
      LoggerUtil.error("정적 에러 메시지");

      expect(consoleSpy.error).toHaveBeenCalledWith("❌ 정적 에러 메시지", "");
    });

    it("정적 debug 메서드가 prefix 없이 로그를 출력한다", () => {
      LoggerUtil.debug("정적 디버그 메시지");

      expect(consoleSpy.debug).toHaveBeenCalledWith("🐛 정적 디버그 메시지", "");
    });
  });

  describe("데이터 처리", () => {
    it("data가 없을 때 빈 문자열을 출력한다", () => {
      const logger = LoggerUtil.create("[Test]");

      logger.info("데이터 없는 메시지");

      expect(consoleSpy.log).toHaveBeenCalledWith("🔍 [Test] 데이터 없는 메시지", "");
    });

    it("복잡한 객체 데이터를 그대로 전달한다", () => {
      const logger = LoggerUtil.create("[Test]");
      const complexData = {
        nested: {
          array: [1, 2, 3],
          boolean: true,
          null: null,
          undefined: undefined,
        },
      };

      logger.info("복잡한 데이터", complexData);

      expect(consoleSpy.log).toHaveBeenCalledWith("🔍 [Test] 복잡한 데이터", complexData);
    });
  });

  describe("prefix 처리", () => {
    it("빈 prefix로도 logger를 생성할 수 있다", () => {
      const logger = new LoggerUtil("");

      logger.info("빈 prefix 테스트");

      expect(consoleSpy.log).toHaveBeenCalledWith("🔍  빈 prefix 테스트", "");
    });

    it("다양한 형태의 prefix를 지원한다", () => {
      const prefixes = ["[Component]", "Service:", "🚀 Module", "API-Handler"];

      prefixes.forEach((prefix) => {
        const logger = LoggerUtil.create(prefix);
        logger.info("테스트");

        expect(consoleSpy.log).toHaveBeenCalledWith(`🔍 ${prefix} 테스트`, "");
      });
    });
  });
});
