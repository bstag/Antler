import { describe, it, expect, vi } from "vitest";
import { POST } from '../../../../pages/admin/api/files/upload';
import path from "path";
import fs from "fs/promises";

// Mock fs and path
vi.mock("fs/promises", () => ({
  default: {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
  },
}));

// Mock process.cwd
const mockCwd = "/app";
vi.spyOn(process, "cwd").mockReturnValue(mockCwd);

describe("POST /admin/api/files/upload", () => {
  it("should reject a file with a mismatching extension", async () => {
    const mockFile = {
      name: "exploit.html",
      type: "image/png",
      size: 1024,
      arrayBuffer: async () => new ArrayBuffer(8),
    };

    const request = {
      formData: async () => ({
        get: (key: string) => {
          if (key === "file") return mockFile;
          if (key === "directory") return "uploads";
          return null;
        },
      }),
    };

    const response = await POST({ request } as any);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid file extension");
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it("should accept a file with a matching extension", async () => {
    const mockFile = {
      name: "image.png",
      type: "image/png",
      size: 1024,
      arrayBuffer: async () => new ArrayBuffer(8),
    };

    const request = {
      formData: async () => ({
        get: (key: string) => {
          if (key === "file") return mockFile;
          if (key === "directory") return "uploads";
          return null;
        },
      }),
    };

    const response = await POST({ request } as any);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.data.filename).toMatch(/\.png$/);
    expect(fs.writeFile).toHaveBeenCalled();
  });
});
