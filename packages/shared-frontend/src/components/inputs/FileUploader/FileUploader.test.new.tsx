import { render, screen } from "@testing-library/react";
import { makeAutoObservable } from "mobx";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FileUploader, FileUploaderStore } from "./FileUploader";

// Mock MobX state
class TestState {
  file: any = null;

  constructor() {
    makeAutoObservable(this);
  }
}

// Mock dependencies
vi.mock("../../../hooks", () => ({
  useMobxHookForm: (initialValue: any, _state: any, _path: string) => ({
    localState: {
      get value() {
        return initialValue;
      },
      set value(newValue: any) {
        // MobX style setter
        Object.assign(this, { _value: newValue });
      },
    },
  }),
}));

describe("FileUploaderStore", () => {
  let store: FileUploaderStore;

  beforeEach(() => {
    store = new FileUploaderStore();
  });

  it("should initialize with no file", () => {
    expect(store.file).toBeNull();
    expect(store.hasFile).toBe(false);
  });

  it("should initialize with provided file", () => {
    const initialFile = { id: "1", name: "test.jpg" };
    const storeWithFile = new FileUploaderStore(initialFile);
    expect(storeWithFile.file).toEqual(initialFile);
    expect(storeWithFile.hasFile).toBe(true);
  });

  it("should set file", () => {
    const file = { id: "1", name: "test.jpg" };
    store.setFile(file);
    expect(store.file).toEqual(file);
    expect(store.hasFile).toBe(true);
  });

  it("should clear file", () => {
    const file = { id: "1", name: "test.jpg" };
    store.setFile(file);
    store.clearFile();
    expect(store.file).toBeNull();
    expect(store.hasFile).toBe(false);
  });
});

describe("FileUploader", () => {
  let testState: TestState;

  beforeEach(() => {
    testState = new TestState();
  });

  it("should render with single file upload", () => {
    render(<FileUploader state={testState} path="file" type="image" />);

    expect(screen.getByText("파일 선택")).toBeDefined();
  });

  it("should render with custom label", () => {
    const customLabel = "이미지 업로드";
    render(<FileUploader state={testState} path="file" type="image" label={customLabel} />);

    expect(screen.getByText(customLabel)).toBeDefined();
  });

  it("should display upload area when no file", () => {
    render(<FileUploader state={testState} path="file" type="image" />);

    const uploadText = screen.getByText("파일 선택");
    expect(uploadText).toBeDefined();
  });

  it("should set correct accept attribute for image type", () => {
    const { container } = render(<FileUploader state={testState} path="file" type="image" />);

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput?.getAttribute("accept")).toBe("image/*");
  });

  it("should set correct accept attribute for video type", () => {
    const { container } = render(<FileUploader state={testState} path="file" type="video" />);

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput?.getAttribute("accept")).toBe("video/*");
  });

  it("should set correct accept attribute for all type", () => {
    const { container } = render(<FileUploader state={testState} path="file" type="all" />);

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput?.getAttribute("accept")).toBe("image/*, video/*");
  });

  it("should render file upload input with correct properties", () => {
    const mockOnFilesChange = vi.fn();

    const { container } = render(
      <FileUploader state={testState} path="file" type="image" onFilesChange={mockOnFilesChange} />,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    expect(fileInput).toBeDefined();
    expect(fileInput?.getAttribute("accept")).toBe("image/*");
    expect(fileInput?.multiple).toBe(false);
  });

  it("should render in dark mode and light mode", () => {
    // Light mode test
    const { rerender } = render(
      <div className="light">
        <FileUploader state={testState} path="file" type="image" />
      </div>,
    );

    expect(screen.getByText("파일 선택")).toBeDefined();

    // Dark mode test
    rerender(
      <div className="dark">
        <FileUploader state={testState} path="file" type="image" />
      </div>,
    );

    expect(screen.getByText("파일 선택")).toBeDefined();
  });
});
