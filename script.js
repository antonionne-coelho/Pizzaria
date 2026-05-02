function showSection(sectionId) {
    // Esconde todas as seções
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        sec.style.display = 'none';
    });

    // Mostra apenas a seção clicada
    const target = document.getElementById(sectionId);
    if (target) {
        // Se for home, usamos flex para centralizar o texto da capa
        target.style.display = (sectionId === 'home') ? 'flex' : 'block';
    }
}