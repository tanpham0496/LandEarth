const formatCharacter = (name) => {
    if(!name) return "";
    const nameLength = name && name.length;
    return name.slice(0, Math.ceil(nameLength * 0.3)).padEnd(nameLength, 'X');
};

export {
    formatCharacter,
}