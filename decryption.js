async function decryptHTML(filename, password) {
    const response = await fetch(filename);
    const encrypted = await response.json();

    const salt = Uint8Array.from(
        atob(encrypted.salt),
        c => c.charCodeAt(0)
    );

    const iv = Uint8Array.from(
        atob(encrypted.iv),
        c => c.charCodeAt(0)
    );

    const data = Uint8Array.from(
        atob(encrypted.data),
        c => c.charCodeAt(0)
    );

    const passwordKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const aesKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 200000,
            hash: "SHA-256"
        },
        passwordKey,
        {
            name: "AES-GCM",
            length: 256
        },
        false,
        ["decrypt"]
    );

    try {
        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv
            },
            aesKey,
            data
        );

        return new TextDecoder().decode(decrypted);
    } catch {
        return "Špatné heslo / poškozená data";
    }
}

async function decryptInput() {
    let filenameInput = document.getElementById("filename");
    let filename = filenameInput.options[filenameInput.selectedIndex].text;
    let password = document.getElementById("password").value;

    const html = await decryptHTML("encrypted/" + filename + ".json", password);
    document.open();
    document.write(html);
    document.close();
}