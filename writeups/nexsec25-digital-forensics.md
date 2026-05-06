# NEXSEC 2025 - Digital Forensics

**CTF:** NEXSEC 2025  
**Team:** BATERIAAA  
**Category:** Digital Forensics

---

## OhMyFiles #1 - SHA256 of Disk Image

Extracted the `.E01` forensic disk image from the downloaded ZIP file.

```bash
sha256sum FAKHRIWORKSTATION_20251211.E01
```

**Flag:** `nexsec25{c8f31718462337b4cc8218c2ca301ca9ca6122cca71c708757f38788533ca076}`

---

## OhMyFiles #2 - Ransomware Extension

Used **FTK Imager** to browse the disk image. Navigated to `/root/Users/Fakhri` and found encrypted files like `BigClient_Proposal_2025.docx`. The extension added was `.lock`.

**Flag:** `nexsec25{.lock}`

---

## OhMyFiles #3 - Deleted Archive Hash

Found deleted archive in `$Recycle.Bin`: `$R96XXEX.rar` containing `Resume_Template.docx`.

Exported file hash list from FTK Imager, got MD5: `f2c0ab329c77f8ba78aca67fcd4b4f63`

Searched on VirusTotal to get the SHA-256.

**Flag:** `nexsec25{cfaa2ce425e2f472618323dcbceb2e3fc013100919a8dbf545bf15b4c45dae8f}`

---

## OhMyFiles #4 - CVE Identification

From VirusTotal results of the previous MD5 lookup, the CVE was listed as a label.

**Flag:** `nexsec25{CVE-2025-8088}`

---

## OhMyFiles #5 - MITRE ATT&CK Technique

The exploit uses path traversal from a malicious RAR archive to drop a payload into the Windows Startup folder. This maps to MITRE ATT&CK technique **T1547.001** (Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder).

Verified by finding `startup.lnk` in FTK Imager at:
`\Users\Fakhri\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\`

**Flag:** `nexsec25{T1547.001}`

---

## OhMyFiles #6 - Ransomware Full Path

Exported `startup.lnk` hash from FTK Imager. Searched MD5 `ce0263c67efa50a3cf8bf8fb0ba1d699` on VirusTotal.

LNK info revealed:
- Path traversal payload: `..\..\AppData\Local\svchost.exe`
- Target path: `AppData\Local\svchost.exe`

Full path for user Fakhri:

**Flag:** `nexsec25{C:\Users\Fakhri\AppData\Local\svchost.exe}`

---

## OhMyFiles #7 - Cipher Algorithm

Used **Registry Explorer** to analyze `NTUSER.DAT` from `Users\Fakhri`.

Found registry key `SOFTWARE\ShadowCrypt` with subfolders:
- **Info** - contained the encryption method: `XOR`
- **Keys** - contained per-file encryption keys

**Flag:** `nexsec25{XOR}`

---

## OhMyFiles #8 - Encryption Keys Location

From the previous challenge, the keys were stored at:

**Flag:** `nexsec25{HKCU\SOFTWARE\ShadowCrypt\Keys}`

---

## OhMyFiles #9 - Decrypt and Recover

Extracted `.lock` files from `Users\Fakhri\Documents` using FTK Imager. Used CyberChef with UTF-8 input and XOR operation, testing each key from the registry against each encrypted file.

**Flag:** `nexsec25{sh4d0w_crypt_m4st3r_2025}`

---

## OhMyFiles #10 - Reverse Engineering the Ransomware

1. Extracted `$R96XXEK.rar` from FTK Imager, unzipped with 7zip (in sandbox)
2. Found `svchost.exe` at the path traversal location `AppData\Local\`
3. Ran `strings svchost.exe` -- output indicated Python libraries
4. Used **pyinstxtractor.py** to decompile `.exe` to `.pyc`
5. Used **pylingual** to decompile `.pyc` to readable Python
6. Found constants `DECRYPT` and `RANSOM` in the code

**Flag:** `nexsec25{DECRYPT_RANSOM}`

---

## MEMOIR #1 - #9 (Memory Forensics)

Used **Volatility 3** to analyze a memory dump.

### MEMOIR #1 - Malicious Document
```bash
python3 vol.py -f memdump.mem windows.cmdline | grep -iE "Downloads|Desktop|Users"
```
Found `WINWORD.EXE` opening `Jemputan_bengkel_Strategik.docx`, which triggered suspicious PowerShell activity.

**Flag:** `nexsec25{Jemputan_bengkel_Strategik.docx}`

### MEMOIR #2 - C2 Server
```bash
python3 vol.py -f memdump.mem windows.netscan | grep -iE "powershell|team.exe"
```
`team.exe` maintained connection to `188.166.181.254` on ports 8000 and 443.

**Flag:** `nexsec25{188.166.181.254}`

### MEMOIR #3 - GitHub Username
From the PowerShell command fetching `cat.ps1` from GitHub.

**Flag:** `nexsec25{kimmisuuki}`

### MEMOIR #4 - Credential Dumper Hash
```bash
python3 vol.py -f memdump.mem windows.amcache | grep -iE "mk.exe|team.exe"
```
`mk.exe` by `gentilkiwi` = **Mimikatz**

**Flag:** `nexsec25{d1f7832035c3e8a73cc78afd28cfd7f4cece6d20}`

### MEMOIR #5 - UAC Bypass Script
Found Base64-encoded PowerShell in `windows.cmdline` output. Decoded to reveal `EventViewerRCE.ps1`.

**Flag:** `nexsec25{EventViewerRCE.ps1}`

### MEMOIR #6 - Backdoor Hash
```bash
python3 vol.py -f memdump.mem windows.amcache.Amcache | grep "team.exe"
```

**Flag:** `nexsec25{255d932fa4418ac11b384b125a7d7d91f8eb28f4}`

### MEMOIR #7 - Persistence Value
Used `windows.registry.hivelist` to find offsets, then examined HKLM registry for Run keys.

**Flag:** `nexsec25{selamat}`

### MEMOIR #8 - Created User Account
```bash
strings -e l memdump.mem | grep -i "net user" | grep "/add"
```

**Flag:** `nexsec25{fakhri:admin123}`

### MEMOIR #9 - Exfiltrated File
```bash
strings -e l memdump.mem | grep -i "curl" | grep -i ".zip"
```
Found upload command sending file to C2 server.

**Flag:** `nexsec25{Documents.zip}`
