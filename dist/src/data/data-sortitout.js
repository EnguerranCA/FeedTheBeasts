let SortItOutData = {};

SortItOutData.getAll = function () {
    return data;
};

SortItOutData.getRandomSortItOut = async function () {
    let recentIds = []; // Store recent IDs

    let newSortItOut;
    do {
        // Fetch a random place
        let response = await fetch("https://mmi.unilim.fr/~savary23/Let_Him_Quizz/api/sort?difficulty=hard");
        newSortItOut = await response.json();
    } while (recentIds.includes(newSortItOut.id));

    // Update recent IDs
    recentIds.push(newSortItOut.id);
    if (recentIds.length > 3) {
        recentIds.shift(); // Keep only the last 3 IDs
    }

    // Process the responses
    let processedSortItOut = {
        difficulty: newSortItOut.difficulty,
        id: newSortItOut.id,
        question: newSortItOut.question,
        responses: [
            processResponse(newSortItOut.reponse1),
            processResponse(newSortItOut.reponse2),
            processResponse(newSortItOut.reponse3),
            processResponse(newSortItOut.reponse4)
        ]
    };

    return processedSortItOut;
};

function processResponse(response) {
    let parts = response.split("§");
    return {
        answer: parts[0].trim(),
        solution: parts[1] ? parts[1].trim() : null
    };
}

export { SortItOutData };
