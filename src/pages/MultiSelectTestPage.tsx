import React, { useState } from "react";
import { MultiSelect } from "../components/ui/multi-select";
import { MultiSelectSimple } from "../components/ui/multi-select-simple";

const testOptions = [
  { value: 1, label: "Option 1" },
  { value: 2, label: "Option 2" },
  { value: 3, label: "Option 3" },
  { value: "string-value", label: "String Option" },
  { value: true, label: "Boolean Option" },
];

const testCyrillicOptions = [
  { value: 1, label: "Адабият" },
  { value: 2, label: "Тарих" },
  { value: 3, label: "Фәнлер" },
  { value: 4, label: "Сөзлүк" },
];

export default function MultiSelectTestPage() {
  const [selected1, setSelected1] = useState<(string | number | boolean)[]>([]);
  const [selected2, setSelected2] = useState<(string | number | boolean)[]>([
    1, 3,
  ]);
  const [selected3, setSelected3] = useState<(string | number | boolean)[]>([]);
  const [selected4, setSelected4] = useState<(string | number | boolean)[]>([]);
  const [selected5, setSelected5] = useState<(string | number | boolean)[]>([]);
  const [clickTest, setClickTest] = useState<string[]>([]);

  const handleChange1 = (newSelected: (string | number | boolean)[]) => {
    console.log("Test 1 changed:", newSelected);
    setSelected1(newSelected);
  };

  const handleChange2 = (newSelected: (string | number | boolean)[]) => {
    console.log("Test 2 changed:", newSelected);
    setSelected2(newSelected);
  };

  const handleChange3 = (newSelected: (string | number | boolean)[]) => {
    console.log("Test 3 changed:", newSelected);
    setSelected3(newSelected);
  };

  const handleChange4 = (newSelected: (string | number | boolean)[]) => {
    console.log("Test 4 changed:", newSelected);
    setSelected4(newSelected);
  };

  const handleChange5 = (newSelected: (string | number | boolean)[]) => {
    console.log("Test 5 changed:", newSelected);
    setSelected5(newSelected);
  };

  const addClickTest = (test: string) => {
    setClickTest((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${test}`,
    ]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
        <strong>Debug Instructions:</strong>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Open browser Developer Tools (F12)</li>
          <li>Go to Console tab</li>
          <li>Try clicking on the multiselect components below</li>
          <li>Check console for any error messages or logs</li>
          <li>Test both the original and simplified versions</li>
          <li>Test the basic click detection buttons first</li>
        </ol>
      </div>

      {/* Click Test Section */}
      <div className="bg-green-50 border border-green-200 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold text-green-800 mb-3">
          Basic Click Test
        </h2>
        <div className="space-x-2 mb-3">
          <button
            onClick={() => addClickTest("Basic button clicked")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Button 1
          </button>
          <button
            onMouseDown={() => addClickTest("Mouse down event")}
            onMouseUp={() => addClickTest("Mouse up event")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Button 2
          </button>
          <div
            onClick={() => addClickTest("Div clicked")}
            className="inline-block px-4 py-2 bg-gray-200 cursor-pointer rounded hover:bg-gray-300"
          >
            Test Div
          </div>
        </div>
        <div className="max-h-32 overflow-y-auto bg-white border rounded p-2">
          <strong>Click Log:</strong>
          {clickTest.length === 0 ? (
            <div className="text-gray-500 text-sm">No clicks detected yet</div>
          ) : (
            <ul className="text-sm space-y-1">
              {clickTest.map((test, idx) => (
                <li key={idx} className="font-mono text-xs">
                  {test}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        MultiSelect Component Testing & Debugging
      </h1>

      <div className="space-y-8">
        {/* Test 1: Simplified MultiSelect (should work) */}
        <div className="space-y-2 p-4 border border-green-200 rounded-lg bg-green-50">
          <h2 className="text-lg font-semibold text-green-800">
            ✅ Test 1: Simplified MultiSelect (Should Work)
          </h2>
          <div className="max-w-md">
            <MultiSelectSimple
              options={testOptions}
              selected={selected1}
              onChange={handleChange1}
              placeholder="Click me - I should work!"
            />
          </div>
          <div className="text-sm text-gray-600">
            Selected: <code>{JSON.stringify(selected1)}</code>
          </div>
          <div className="text-xs text-green-700">
            This uses a simplified implementation without Radix UI components.
          </div>
        </div>

        {/* Test 2: Original MultiSelect */}
        <div className="space-y-2 p-4 border border-red-200 rounded-lg bg-red-50">
          <h2 className="text-lg font-semibold text-red-800">
            ❌ Test 2: Original MultiSelect (Might Not Work)
          </h2>
          <div className="max-w-md">
            <MultiSelect
              options={testOptions}
              selected={selected2}
              onChange={handleChange2}
              placeholder="Original version"
            />
          </div>
          <div className="text-sm text-gray-600">
            Selected: <code>{JSON.stringify(selected2)}</code>
          </div>
          <div className="text-xs text-red-700">
            This uses the original Radix UI implementation that might have
            issues.
          </div>
        </div>

        {/* Test 3: Cyrillic with Simplified */}
        <div className="space-y-2 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h2 className="text-lg font-semibold text-blue-800">
            🔤 Test 3: Cyrillic Text (Simplified)
          </h2>
          <div className="max-w-md">
            <MultiSelectSimple
              options={testCyrillicOptions}
              selected={selected3}
              onChange={handleChange3}
              placeholder="Опцияларды тандаңыз..."
            />
          </div>
          <div className="text-sm text-gray-600">
            Selected: <code>{JSON.stringify(selected3)}</code>
          </div>
          <div className="text-xs text-blue-700">
            Testing with Cyrillic text to ensure unicode support.
          </div>
        </div>

        {/* Test 4: Cyrillic with Original */}
        <div className="space-y-2 p-4 border border-purple-200 rounded-lg bg-purple-50">
          <h2 className="text-lg font-semibold text-purple-800">
            🔤 Test 4: Cyrillic Text (Original)
          </h2>
          <div className="max-w-md">
            <MultiSelect
              options={testCyrillicOptions}
              selected={selected4}
              onChange={handleChange4}
              placeholder="Опцияларды тандаңыз..."
            />
          </div>
          <div className="text-sm text-gray-600">
            Selected: <code>{JSON.stringify(selected4)}</code>
          </div>
          <div className="text-xs text-purple-700">
            Cyrillic text with original implementation.
          </div>
        </div>

        {/* Test 5: Disabled State */}
        <div className="space-y-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            🚫 Test 5: Disabled State
          </h2>
          <div className="max-w-md">
            <MultiSelectSimple
              options={testOptions}
              selected={[1, 2]}
              onChange={handleChange5}
              placeholder="This is disabled"
              disabled={true}
            />
          </div>
          <div className="text-sm text-gray-600">
            This should appear grayed out and non-interactive.
          </div>
        </div>

        {/* Control Panel */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Control Panel</h3>
          <div className="space-x-2">
            <button
              onClick={() => {
                setSelected1([]);
                setSelected2([1, 3]);
                setSelected3([]);
                setSelected4([]);
                setSelected5([]);
                setClickTest([]);
                console.log("All multiselects reset");
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reset All
            </button>
            <button
              onClick={() => {
                setSelected1([1, 2, 3]);
                setSelected2([1, 2, "string-value"]);
                setSelected3([1, 3]);
                setSelected4([2, 4]);
                console.log("All multiselects filled with test data");
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Fill Test Data
            </button>
            <button
              onClick={() => {
                console.clear();
                console.log("Console cleared - start testing now");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Console
            </button>
            <button
              onClick={() => {
                // Check for overlay elements
                const overlays =
                  document.querySelectorAll('[style*="z-index"]');
                const highZIndex = Array.from(overlays).filter((el: any) => {
                  const zIndex = parseInt(window.getComputedStyle(el).zIndex);
                  return zIndex > 100;
                });
                console.log("High z-index elements:", highZIndex);
                addClickTest(
                  `Found ${highZIndex.length} high z-index elements`,
                );

                // Check for pointer-events: none
                const noPointer = document.querySelectorAll(
                  '[style*="pointer-events"]',
                );
                console.log("Elements with pointer-events styling:", noPointer);
                addClickTest(
                  `Found ${noPointer.length} elements with pointer-events styling`,
                );
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Check Overlays
            </button>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">System Information:</h3>
          <div className="text-sm space-y-1 font-mono">
            <div>Browser: {navigator.userAgent}</div>
            <div>
              Screen: {window.innerWidth} x {window.innerHeight}
            </div>
            <div>
              Dark mode:{" "}
              {document.documentElement.classList.contains("dark")
                ? "Yes"
                : "No"}
            </div>
            <div>Timestamp: {new Date().toISOString()}</div>
          </div>
        </div>

        {/* Current State Debug */}
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
          <h3 className="font-semibold mb-2">Current States (Live Debug):</h3>
          <div className="text-sm space-y-1 font-mono">
            <div>Test 1 (Simple): {JSON.stringify(selected1)}</div>
            <div>Test 2 (Original): {JSON.stringify(selected2)}</div>
            <div>Test 3 (Cyrillic Simple): {JSON.stringify(selected3)}</div>
            <div>Test 4 (Cyrillic Original): {JSON.stringify(selected4)}</div>
            <div>Test 5 (Disabled): [1, 2] (fixed)</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Testing Instructions:
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • <strong>If Test 1 works but Test 2 doesn't:</strong> The issue
              is with Radix UI components
            </li>
            <li>
              • <strong>If neither works:</strong> There might be a CSS or
              JavaScript conflict
            </li>
            <li>
              • <strong>If you see console errors:</strong> Share those error
              messages
            </li>
            <li>
              • <strong>If nothing happens when clicking:</strong> It's likely
              an event handling issue
            </li>
            <li>
              • <strong>If dropdown doesn't appear:</strong> Check for z-index
              or positioning issues
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
