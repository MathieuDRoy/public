function placeOnWall(coordinate, index, count, nft) {
    if(coordinate === "x") {
        if (index < 12 ) {
            if (index < 6 ) {
            return -20 + ((index) *8);
            } else
            return -20 + ((index-6) *8);
        } else if (index >= 12 && index < 24) {
            return 24.99;
        } else if (index >= 24 && index < 36) {
            if (index >= 24 && index < 30 ) {
            return 20 - ((index-24) *8);
            } else
            return 20 - ((index-30) *8);
        } else if (index >= 36 && index <= 48) {
            return -24.99;
        } 
    } else if (coordinate === "y") {
        if (count <= 6 ) {
            return 10
        } else {
            if (index < 6 ) {
            return 7;
            } else if (index >= 6 && index < 12) {
            return 15;
            } else if (index >= 12 && index < 18) {
            return 7;
            } else if (index >= 18 && index < 24) {
            return 15;
            } else if (index >= 24 && index < 30) {
            return 7;
            } else if (index >= 30 && index < 36) {
            return 15;
            } else if (index >= 36 && index < 42) {
            return 7;
            } else if (index >= 42 && index <= 48) {
            return 15;
            }
        }
    } else if (coordinate === "z") {
        if (index < 12 ) {
            return -24.99;
        } else if (index >= 12 && index < 24) {
            if (index >= 12 && index < 18 ) {
            return -27 + ((index-11) * 8);
            } else {
            return -27 + ((index-17) * 8);
            }
        } else if (index >= 24 && index < 36) {
            return 24.99;
        } else if (index >= 36 && index <= 48) {
            if (index >= 36 && index < 42 ) {
            return 27 - ((index-35) * 8);
            } else {
            return 27 - ((index-41) * 8);
            }
        }
    } else {
        console.error("Invalid coordinate specified. Must be 'x', 'y', or 'z'. " + index + " " + coordinate + " " + count + " " + nft);
        return null;
    }
}

function rotateForWall(index) {
    if (index >= 12 && index < 24) {
        return -Math.PI/2;
    } else if (index >= 24 && index < 36) {
        return Math.PI;
    } else if (index >= 36 && index < 48) {
        return Math.PI/2;
    } else {
        return 0;
    }
}