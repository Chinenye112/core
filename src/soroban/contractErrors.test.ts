import { describe, it, expect } from "vitest";
import {
  decodeContractError,
  decodeContractErrorSafe,
  createContractErrorMap,
  mergeContractErrorMaps,
  DEFAULT_CONTRACT_ERROR_MAP,
  FACTORY_CONTRACT_ERRORS,
  ROUTER_CONTRACT_ERRORS,
  FACTORY_ERROR_CODES,
  ROUTER_ERROR_CODES,
} from "./contractErrors";

describe("contractErrors", () => {
  describe("DEFAULT_CONTRACT_ERROR_MAP namespace collision fix", () => {
    // Factory numeric codes with namespace prefix
    it("resolves FACTORY_1 to PAIR_ALREADY_EXISTS", () => {
      const result = decodeContractError(
        "FACTORY_1",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("already exists");
      expect(result.code).toBe("FACTORY_1");
    });

    it("resolves FACTORY_2 to INVALID_FIRST_TOKEN", () => {
      const result = decodeContractError(
        "FACTORY_2",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("not a valid token");
      expect(result.code).toBe("FACTORY_2");
    });

    it("resolves FACTORY_3 to INVALID_SECOND_TOKEN", () => {
      const result = decodeContractError(
        "FACTORY_3",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("not a valid token");
      expect(result.code).toBe("FACTORY_3");
    });

    it("resolves FACTORY_4 to IDENTICAL_TOKENS", () => {
      const result = decodeContractError(
        "FACTORY_4",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("identical");
      expect(result.code).toBe("FACTORY_4");
    });

    it("resolves FACTORY_5 to UNAUTHORIZED", () => {
      const result = decodeContractError(
        "FACTORY_5",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("not authorized");
      expect(result.code).toBe("FACTORY_5");
    });

    // Router numeric codes with namespace prefix
    it("resolves ROUTER_1 to ROUTER_INVALID_PATH", () => {
      const result = decodeContractError(
        "ROUTER_1",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("swap path");
      expect(result.code).toBe("ROUTER_1");
    });

    it("resolves ROUTER_2 to ROUTER_INSUFFICIENT_LIQUIDITY", () => {
      const result = decodeContractError(
        "ROUTER_2",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("Insufficient liquidity");
      expect(result.code).toBe("ROUTER_2");
    });

    it("resolves ROUTER_3 to ROUTER_SLIPPAGE_EXCEEDED", () => {
      const result = decodeContractError(
        "ROUTER_3",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("slippage");
      expect(result.code).toBe("ROUTER_3");
    });

    it("resolves ROUTER_4 to EXPIRED_DEADLINE", () => {
      const result = decodeContractError(
        "ROUTER_4",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("deadline");
      expect(result.code).toBe("ROUTER_4");
    });

    it("resolves ROUTER_5 to EXCESSIVE_INPUT_AMOUNT", () => {
      const result = decodeContractError(
        "ROUTER_5",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("input amount");
      expect(result.code).toBe("ROUTER_5");
    });

    // Symbolic names resolve from both maps
    it("resolves PAIR_ALREADY_EXISTS symbolic name", () => {
      const result = decodeContractError(
        "PAIR_ALREADY_EXISTS",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("already exists");
      expect(result.code).toBe("PAIR_ALREADY_EXISTS");
    });

    it("resolves ROUTER_SLIPPAGE_EXCEEDED symbolic name", () => {
      const result = decodeContractError(
        "ROUTER_SLIPPAGE_EXCEEDED",
        DEFAULT_CONTRACT_ERROR_MAP,
      );
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("slippage");
      expect(result.code).toBe("ROUTER_SLIPPAGE_EXCEEDED");
    });
  });

  describe("contract-specific maps use namespaced numeric codes", () => {
    it("resolves FACTORY_1 to PAIR_ALREADY_EXISTS in FACTORY_CONTRACT_ERRORS", () => {
      const result = decodeContractError("FACTORY_1", FACTORY_CONTRACT_ERRORS);
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("already exists");
      expect(result.code).toBe("FACTORY_1");
    });

    it("resolves FACTORY_5 to UNAUTHORIZED in FACTORY_CONTRACT_ERRORS", () => {
      const result = decodeContractError("FACTORY_5", FACTORY_CONTRACT_ERRORS);
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("not authorized");
      expect(result.code).toBe("FACTORY_5");
    });

    it("resolves ROUTER_1 to ROUTER_INVALID_PATH in ROUTER_CONTRACT_ERRORS", () => {
      const result = decodeContractError("ROUTER_1", ROUTER_CONTRACT_ERRORS);
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("swap path");
      expect(result.code).toBe("ROUTER_1");
    });

    it("resolves ROUTER_8 to MINIMUM_LIQUIDITY in ROUTER_CONTRACT_ERRORS", () => {
      const result = decodeContractError("ROUTER_8", ROUTER_CONTRACT_ERRORS);
      expect(result.decoded).toBe(true);
      expect(result.message).toContain("minimum liquidity");
      expect(result.code).toBe("ROUTER_8");
    });
  });

  describe("all factory and router codes are mapped", () => {
    it("all FACTORY_ERROR_CODES have entries in FACTORY_CONTRACT_ERRORS", () => {
      for (const [name, code] of Object.entries(FACTORY_ERROR_CODES)) {
        expect(FACTORY_CONTRACT_ERRORS[name]).toBeDefined(
          `Missing entry for ${name}`,
        );
        expect(FACTORY_CONTRACT_ERRORS[`FACTORY_${code}`]).toBeDefined(
          `Missing namespaced numeric entry for ${name} (code FACTORY_${code})`,
        );
      }
    });

    it("all ROUTER_ERROR_CODES have entries in ROUTER_CONTRACT_ERRORS", () => {
      for (const [name, code] of Object.entries(ROUTER_ERROR_CODES)) {
        expect(ROUTER_CONTRACT_ERRORS[name]).toBeDefined(
          `Missing entry for ${name}`,
        );
        expect(ROUTER_CONTRACT_ERRORS[`ROUTER_${code}`]).toBeDefined(
          `Missing namespaced numeric entry for ${name} (code ROUTER_${code})`,
        );
      }
    });
  });
});

// ─── New helpers (#39) ────────────────────────────────────────────────────────

describe("createContractErrorMap", () => {
  it("registers a numeric code as a string key", () => {
    const map = createContractErrorMap([
      { code: 100, message: "Vault is locked" },
    ]);
    expect(map["100"]).toBeDefined();
    expect(map["100"]!.message).toBe("Vault is locked");
  });

  it("registers a string code as-is", () => {
    const map = createContractErrorMap([
      { code: "CUSTOM_ERROR", message: "Custom failure" },
    ]);
    expect(map["CUSTOM_ERROR"]).toBeDefined();
    expect(map["CUSTOM_ERROR"]!.message).toBe("Custom failure");
  });

  it("registers remediation when provided", () => {
    const map = createContractErrorMap([
      { code: 42, message: "Something broke", remediation: "Try again later." },
    ]);
    expect(map["42"]!.remediation).toBe("Try again later.");
  });

  it("omits remediation field when not provided", () => {
    const map = createContractErrorMap([
      { code: 10, message: "No remediation" },
    ]);
    expect(map["10"]!.remediation).toBeUndefined();
  });

  it("handles an empty entries array", () => {
    const map = createContractErrorMap([]);
    expect(Object.keys(map)).toHaveLength(0);
  });

  it("resolves via decodeContractError using the custom map", () => {
    const map = createContractErrorMap([
      { code: 100, message: "Vault is locked", remediation: "Wait for the timelock." },
    ]);
    const result = decodeContractError(100, map);
    expect(result.decoded).toBe(true);
    expect(result.message).toBe("Vault is locked");
    expect(result.remediation).toBe("Wait for the timelock.");
  });
});

describe("mergeContractErrorMaps", () => {
  it("merges non-conflicting keys from both maps", () => {
    const a = createContractErrorMap([{ code: 1, message: "One" }]);
    const b = createContractErrorMap([{ code: 2, message: "Two" }]);
    const merged = mergeContractErrorMaps(a, b);
    expect(merged["1"]!.message).toBe("One");
    expect(merged["2"]!.message).toBe("Two");
  });

  it("later map takes priority on conflicting keys", () => {
    const a = createContractErrorMap([{ code: 1, message: "Original" }]);
    const b = createContractErrorMap([{ code: 1, message: "Override" }]);
    const merged = mergeContractErrorMaps(a, b);
    expect(merged["1"]!.message).toBe("Override");
  });

  it("merges with an empty map without losing entries", () => {
    const a = createContractErrorMap([{ code: 5, message: "Five" }]);
    const merged = mergeContractErrorMaps(a, {});
    expect(merged["5"]!.message).toBe("Five");
  });

  it("merges the built-in factory map with a custom map", () => {
    const custom = createContractErrorMap([
      { code: 999, message: "App-specific error" },
    ]);
    const merged = mergeContractErrorMaps(FACTORY_CONTRACT_ERRORS, custom);
    expect(merged["PAIR_ALREADY_EXISTS"]).toBeDefined();
    expect(merged["999"]!.message).toBe("App-specific error");
  });
});

describe("decodeContractErrorSafe", () => {
  it("decodes a known error without throwing", () => {
    const result = decodeContractErrorSafe("PAIR_ALREADY_EXISTS");
    expect(result.decoded).toBe(true);
    expect(result.message).toContain("already exists");
  });

  it("handles null input safely", () => {
    expect(() => decodeContractErrorSafe(null)).not.toThrow();
    const result = decodeContractErrorSafe(null);
    expect(result.decoded).toBe(false);
  });

  it("handles undefined input safely", () => {
    expect(() => decodeContractErrorSafe(undefined)).not.toThrow();
    const result = decodeContractErrorSafe(undefined);
    expect(result.decoded).toBe(false);
  });

  it("handles a circular reference without throwing", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const o: Record<string, any> = {};
    o["self"] = o;
    expect(() => decodeContractErrorSafe(o)).not.toThrow();
  });

  it("preserves the raw value on an unknown error code", () => {
    const raw = { code: 9999, message: "unknown" };
    const result = decodeContractErrorSafe(raw);
    expect(result.raw).toBe(raw);
  });

  it("accepts a custom error map via options", () => {
    const map = createContractErrorMap([
      { code: 77, message: "Custom seventy-seven" },
    ]);
    const result = decodeContractErrorSafe(77, { errorMap: map });
    expect(result.decoded).toBe(true);
    expect(result.message).toBe("Custom seventy-seven");
  });
});

describe("known, unknown, and malformed error values", () => {
  it("decodes a known symbolic name via a custom map", () => {
    const map = createContractErrorMap([
      { code: "VAULT_LOCKED", message: "Vault is locked" },
    ]);
    const result = decodeContractError("VAULT_LOCKED", map);
    expect(result.decoded).toBe(true);
    expect(result.code).toBe("VAULT_LOCKED");
  });

  it("returns decoded: false for an unmapped numeric code", () => {
    const result = decodeContractError(8888, DEFAULT_CONTRACT_ERROR_MAP);
    expect(result.decoded).toBe(false);
    expect(result.code).toBe("8888");
  });

  it("handles an Error object with no message", () => {
    const e = new Error();
    e.message = "";
    const result = decodeContractError(e);
    expect(result.decoded).toBe(false);
  });

  it("handles an empty string input", () => {
    const result = decodeContractError("");
    expect(result.decoded).toBe(false);
    expect(result.code).toBeNull();
  });

  it("handles numeric 0 input", () => {
    const result = decodeContractError(0);
    expect(result.decoded).toBe(false);
    expect(result.code).toBe("0");
  });

  it("handles an object with a null code property", () => {
    const result = decodeContractError({ code: null, message: "some failure" });
    expect(result.decoded).toBe(false);
    expect(result.message).toContain("some failure");
  });

  it("handles an object with an array code property without throwing", () => {
    expect(() => decodeContractError({ code: [1, 2, 3] })).not.toThrow();
  });
});
