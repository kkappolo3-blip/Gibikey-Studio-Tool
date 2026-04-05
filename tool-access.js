// tool-access.js - Letakkan di folder yang sama dengan tools

function checkToolAccess(toolName) {
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    
    if (!userSession) {
        alert('Silakan login terlebih dahulu');
        window.location.href = 'login-otp.html';
        return false;
    }

    // Admin bypass
    if (userSession.isAdmin) {
        logToolAccess(userSession.nama, toolName, userSession.nrp || 'N/A');
        return true;
    }

    // Request NRP input
    const nrp = prompt(`Masukkan NRP Anda untuk akses ${toolName}:`);
    
    if (!nrp) {
        alert('NRP harus diisi untuk akses tool ini');
        return false;
    }

    // Verify NRP
    const approvedMembers = JSON.parse(localStorage.getItem('approvedMembers')) || [];
    const member = approvedMembers.find(m => m.id === userSession.id);

    if (!member) {
        alert('Member tidak ditemukan');
        return false;
    }

    // Store NRP untuk tool
    sessionStorage.setItem('toolNRP', nrp);
    
    logToolAccess(userSession.nama, toolName, nrp);
    return true;
}

function logToolAccess(nama, tool, nrp) {
    const log = {
        nama: nama,
        loginTime: new Date().toLocaleString('id-ID'),
        tool: tool,
        nrpInput: nrp
    };

    let history = JSON.parse(localStorage.getItem('loginHistory')) || [];
    history.push(log);
    localStorage.setItem('loginHistory', JSON.stringify(history));
}

// Tools yang memerlukan akses terbatas (pakai NRP)
const restrictedTools = [
    'Ketapang Khair v2.0',
    'Kesiapsiagaan',
    'Bhabin Gemoy'
];

// Tools yang public (tanpa NRP)
const publicTools = [
    'Tagihan Milenial v3.5',
    'Timestamp Progege',
    'Command Center',
    'Gibikey Karaoke',
    'Makelar Gorontalo'
];
