let budget = 0; // Default value

function getBudget() {
    return budget;
}

function setBudget(newBudget) {
    budget = newBudget;
}

module.exports = { getBudget, setBudget };
