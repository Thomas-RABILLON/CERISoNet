const extractHashtags = (text: string) => {
    const regex = /#(\w+)/g;
    const matches = text.match(regex);
    if (matches) {
        return matches.map(match => match.slice(1));
    }
    return [];
}

export { extractHashtags };