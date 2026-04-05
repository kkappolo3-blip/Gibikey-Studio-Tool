function checkToolAccess(toolName) {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    
    if (!userSession) {
        alert('Silakan login terlebih dahulu');
        window.location.href = 'login-otp.html';
        return false;
    }

    // CEK APAKAH MEMBER DI-BAN
    const banned = JSON.parse(localStorage.getItem('bannedMembers')) || [];
    const isBanned = banned.find(b => b.memberId === userSession.id);

    if (isBanned) {
        const now = new Date().getTime();
        const sisaMs = isBanned.unbanTime - now;
        
        if (sisaMs > 0) {
            const sisaJam = Math.ceil(sisaMs / (1000 * 60 * 60));
            alert(`❌ Akun Anda sedang DI-BAN!\n\nAlasan: ${isBanned.reason}\nSisa waktu ban: ${sisaJam} jam`);
            return false;
        }
    }

    // Admin bypass
    if (userSession.isAdmin) {
        logToolAccess(userSession.nama, toolName, userSession.kode || 'N/A');
        return true;
    }

    // Request Kode input
    const kode = prompt(`Masukkan Kode Anda untuk akses ${toolName}:`);
    
    if (!kode) {
        alert('Kode harus diisi untuk akses tool ini');
        return false;
    }

    // Verify Kode
    const approvedMembers = JSON.parse(localStorage.getItem('approvedMembers')) || [];
    const member = approvedMembers.find(m => m.id === userSession.id);

    if (!member) {
        alert('Member tidak ditemukan');
        return false;
    }

    // Store Kode untuk tool
    sessionStorage.setItem('toolKode', kode);
    
    logToolAccess(userSession.nama, toolName, kode);
    return true;
}

function logToolAccess(nama, tool, kode) {
    const log = {
        nama: nama,
        loginTime: new Date().toLocaleString('id-ID'),
        tool: tool,
        kodeInput: kode
    };

    let history = JSON.parse(localStorage.getItem('loginHistory')) || [];
    history.push(log);
    localStorage.setItem('loginHistory', JSON.stringify(history));
}

// Tools yang memerlukan akses terbatas (pakai Kode)
const restrictedTools = [
    'Ketapang Khair v2.0',
    'Kesiapsiagaan',
    'Bhabin Gemoy'
];

// Tools yang public (tanpa Kode)
const publicTools = [
    'Gibikey Karaoke',
    'Tool Tracker',
    'Tagihan Milenial v3.5',
    'Timestamp Progege',
    'Command Center',
    'Makelar Gorontalo'
];
