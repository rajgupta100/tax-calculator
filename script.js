function calculateTax() {
    const age = parseInt(document.getElementById("age").value);
    const  income = parseFloat(document.getElementById("income").value);

    const isSeniorCitizen = age >= 60 && age < 80;
    const isSuperSeniorCitizen = age >= 80;

    // Deduction limits
    const max80cLimit = 150000;
    const max80dLimit = isSeniorCitizen ? 50000 : 25000;
    const maxHomeLoanInterestLimit = 200000;

    // Get user inputs for deductions
    const deductions = {
        section80c: Math.min(
            parseFloat(document.getElementById("epf").value) || 0 +
            parseFloat(document.getElementById("lifeInsurance").value) || 0 +
            parseFloat(document.getElementById("nsc").value) || 0 +
            parseFloat(document.getElementById("ppf").value) || 0 +
            parseFloat(document.getElementById("fixedDeposit").value) || 0 +
            parseFloat(document.getElementById("sukanya").value) || 0 +
            parseFloat(document.getElementById("homeLoanPrincipal").value) || 0,
            max80cLimit
        ),
        section80d: Math.min(parseFloat(document.getElementById("section80d").value) || 0, max80dLimit),
        homeLoanInterest: Math.min(parseFloat(document.getElementById("loanInterest").value) || 0, maxHomeLoanInterestLimit),
        standardDeduction: 50000 // Fixed standard deduction
    };

    // Total deductions
    const totalDeductions = Object.values(deductions).reduce((acc, val) => acc + val, 0);

    // Net taxable income after deductions
    const netTaxableIncome = Math.max(0, income - totalDeductions);

    // Calculate old regime tax
    const oldRegimeTax = calculateOldRegimeTax(netTaxableIncome, isSeniorCitizen, isSuperSeniorCitizen);

    // Calculate new regime tax
    const newRegimeTax = calculateNewRegimeTax(income);

    // Display the result
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <h3>Results</h3>
        <p>Net Taxable Income: ₹${netTaxableIncome.toFixed(2)}</p>
        <p>Old Regime Tax: ₹${oldRegimeTax.toFixed(2)}</p>
        <p>New Regime Tax: ₹${newRegimeTax.toFixed(2)}</p>
        <p><strong>${oldRegimeTax < newRegimeTax ? 'Old' : 'New'} Regime is Optimal for You</strong></p>
    `;
    resultDiv.style.display = 'block';
}

function calculateOldRegimeTax(income, isSeniorCitizen, isSuperSeniorCitizen) {
    let tax = 0;
    const exemptionLimit = isSuperSeniorCitizen ? 500000 : isSeniorCitizen ? 300000 : 250000;

    if (income > 1000000) {
        tax += (income - 1000000) * 0.30;
        income = 1000000;
    }
    if (income > 500000) {
        tax += (income - 500000) * 0.20;
        income = 500000;
    }
    if (income > exemptionLimit) {
        tax += (income - exemptionLimit) * 0.05;
    }

    // Apply rebate under Section 87A
    if (income <= 500000) {
        tax = Math.max(0, tax - 12500);
    }

    // Add health and education cess
    tax += tax * 0.04;

    return tax;
}

function calculateNewRegimeTax(income) {
    let tax = 0;

    if (income > 1500000) {
        tax += (income - 1500000) * 0.30;
        income = 1500000;
    }
    
    if (income > 1200000) {
        tax += (income - 1200000) * 0.20;
        income = 1200000;
    }
    if (income > 900000) {
        tax += (income - 900000) * 0.15;
        income = 900000;
    }
    if (income > 600000) {
        tax += (income - 600000) * 0.10;
        income = 500000;
    }
    if (income > 300000) {
        tax += (income - 300000) * 0.05;
    }

    // Add health and education cess
    tax += tax * 0.04;

    return tax;
}
