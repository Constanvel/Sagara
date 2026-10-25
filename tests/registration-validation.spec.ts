import { expect, test } from "@playwright/test";
import { jakartaToday, type RegistrationData, validateRegistration } from "../src/components/registration/validation";

const serviceIds = ["khitan"];
const packageIds = ["reguler"];
const now = new Date("2026-10-24T09:00:00+07:00");
const validData: RegistrationData = {
  service: "khitan", package: "reguler", date: "2026-10-24", time: "10:00",
  guardian: "Budi", patient: "Adi", age: "8", whatsapp: "081234567890", consent: true,
};

function validate(overrides: Partial<RegistrationData> = {}, instant = now) {
  return validateRegistration({ ...validData, ...overrides }, serviceIds, packageIds, instant);
}

test("valid registration has no errors", () => {
  expect(validate()).toEqual({});
});

for (const [label, instant, rejected] of [
  ["one millisecond before", "2026-10-24T01:59:59.999Z", false],
  ["exactly at", "2026-10-24T02:00:00.000Z", true],
  ["one millisecond after", "2026-10-24T02:00:00.001Z", true],
] as const) {
  test(`09:00 WIB requested time with now ${label} the requested instant`, () => {
    const errors = validate({ time: "09:00" }, new Date(instant));
    expect(errors.date).toBeUndefined();
    expect(errors.time).toBe(rejected ? "Pilih waktu yang belum lewat (WIB)." : undefined);
  });
}

test("past times are rejected while later times on the same WIB day remain valid", () => {
  const instant = new Date("2026-10-24T10:30:00+07:00");
  expect(validate({ time: "10:00" }, instant).time).toBe("Pilih waktu yang belum lewat (WIB).");
  expect(validate({ time: "11:00" }, instant)).toEqual({});
  expect(validate({ date: "2026-10-25", time: "09:00" }, instant)).toEqual({});
});

test("today changes at WIB midnight, not UTC midnight", () => {
  const beforeMidnight = new Date("2026-10-24T16:59:59.999Z");
  const midnight = new Date("2026-10-24T17:00:00.000Z");
  expect(jakartaToday(beforeMidnight)).toBe("2026-10-24");
  expect(jakartaToday(midnight)).toBe("2026-10-25");
  expect(validate({}, beforeMidnight)).toEqual({ time: "Pilih waktu yang belum lewat (WIB)." });
  expect(validate({}, midnight)).toEqual({ date: "Tanggal tidak boleh sebelum hari ini (WIB)." });
  expect(validate({ date: "2026-10-25", time: "09:00" }, midnight)).toEqual({});
});

for (const date of ["", "not-a-date", "2026-1-01", "2026-10-24T09:00:00", "2026-02-29", "2026-04-31", "2026-13-01"]) {
  test(`malformed date ${JSON.stringify(date)} is rejected without comparing a time`, () => {
    expect(validate({ date, time: "09:00" })).toEqual({ date: "Pilih tanggal yang valid." });
  });
}

for (const time of ["", "24:00", "12:60", "9:00", "09.00", "09:00:00", " 09:00", "09:00 "]) {
  test(`malformed time ${JSON.stringify(time)} keeps its validation error`, () => {
    expect(validate({ time })).toEqual({ time: "Isi waktu dalam format 24 jam HH:mm (00:00–23:59 WIB)." });
  });
}

for (const time of ["00:00", "09:01", "10:17", "12:34", "23:59"]) {
  test(`valid patient-entered time ${time} is accepted without predefined slots`, () => {
    expect(validate({ date: "2026-10-25", time })).toEqual({});
  });
}

test("invalid date and time report their own errors together", () => {
  expect(validate({ date: "2026-02-30", time: "24:00" })).toEqual({
    date: "Pilih tanggal yang valid.", time: "Isi waktu dalam format 24 jam HH:mm (00:00–23:59 WIB).",
  });
});

test("a valid leap day is accepted", () => {
  expect(validate({ date: "2028-02-29" })).toEqual({});
});

for (const field of ["guardian", "patient"] as const) {
  const message = field === "guardian" ? "Isi nama orang tua/wali yang terbaca (2–100 karakter)." : "Isi nama pasien yang terbaca (2–100 karakter).";

  test(`${field} keeps the trimmed 2–100 length boundary`, () => {
    for (const name of ["Ab", "A".repeat(100), "  Ab  ", `  ${"A".repeat(100)}  `]) {
      expect(validate({ [field]: name })).toEqual({});
    }
    for (const name of ["", " A ", "A".repeat(101)]) {
      expect(validate({ [field]: name })).toEqual({ [field]: message });
    }
  });

  test(`${field} rejects names made only of whitespace, controls, format characters or combining marks`, () => {
    const invisibleNames = [
      "  \t\n\u00a0", "\u0000\u0001", "\u007f\u0085", "\u200b\u200d", "\u2060\u200e",
      "\u0301\u0308", "\u093e\u093f", "\u20dd\u20de", " \u200b\u0000\u0301\u093e\u20dd ",
      "\u3164\u3164", "\u115f\u1160", "\uffa0\uffa0",
    ];
    for (const name of invisibleNames) {
      expect(validate({ [field]: name }), JSON.stringify(name)).toEqual({ [field]: message });
    }
  });

  test(`${field} accepts Unicode and preserves the original name without normalization`, () => {
    for (const name of ["Élodie", "Jose\u0301", "李明", "محمد", "अमित", "O’Connor", "  Siti Nur  ", "A\u200d", "A\u0301", "🌸", "--"]) {
      const data = Object.freeze({ ...validData, [field]: name });
      expect(validateRegistration(data, serviceIds, packageIds, now), name).toEqual({});
      expect(data[field]).toBe(name);
    }
  });
}
