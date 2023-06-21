export const parseDice = (notation: string) => {
	// This function parses RPG notation into usable data
	// Converting it to an object
	// Ex: 3d7 => { amount: 3, sides: 7 }

	if (notation.match(/d|D/)) {
		// If this condition meets it means it's using RPG Notation
		const rpg = notation.split(/d|D/);
		return {
			amount: parseInt(rpg[0]),
			sides: parseInt(rpg[1]),
		};
	} else {
		// If this was met, then it's just the number of sides
		return {
			amount: 1,
			sides: parseInt(notation),
		};
	}
};
