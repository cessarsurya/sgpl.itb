function calculate() {
    const densityWater = parseFloat(document.getElementById("density-water").value);
    const densitySediment = parseFloat(document.getElementById("density-sediment").value);
    const diameter = parseFloat(document.getElementById("diameter").value);
    const viscosity = parseFloat(document.getElementById("viscosity").value);
    const z = parseFloat(document.getElementById("z").value);
    const z0 = parseFloat(document.getElementById("z0").value);
    const uz = parseFloat(document.getElementById("uz").value);

    const gravity = 9.81;
    const kappa = 0.4;

    // Sediment to water density ratio
    const s = densitySediment / densityWater;

    // Shear velocity (u*)
    const uStar = (kappa * uz) / Math.log(z / z0);

    // Bed shear stress (τ_b)
    const tauB = densityWater * Math.pow(uStar, 2);

    // Dimensionless particle diameter (D*)
    const dStar = Math.pow((gravity * (s - 1)) / Math.pow(viscosity, 2), 1 / 3) * diameter;

    // Shields parameter (θ)
    const theta = tauB / (gravity * (densitySediment - densityWater) * diameter);

    // Critical Shields parameter (θ_cr)
    const thetaCr = 0.3 / (1 + 1.2 * dStar) + 0.055 * (1 - Math.exp(-0.02 * dStar));

    // Settling velocity (w_s)
    const ws = (viscosity / diameter) * (Math.sqrt(10.36 + 1.049 * Math.pow(dStar, 3)) - 10.36);

    // Determine erosion and deposition status
    const erosionStatus = theta > thetaCr ? "Erosion Occurs" : "No Erosion";
    const depositionStatus = ws > uStar ? "Deposition Occurs" : "No Deposition";

    // Display results
    const results = `
        <strong>Results:</strong><br>
        Shear Velocity (u*): ${uStar.toFixed(6)} m/s<br>
        Bed Shear Stress (τ_b): ${tauB.toFixed(6)} N/m²<br>
        Dimensionless Particle Diameter (D*): ${dStar.toFixed(6)}<br>
        Shields Parameter (θ): ${theta.toFixed(6)}<br>
        Critical Shields Parameter (θ_cr): ${thetaCr.toFixed(6)}<br>
        Settling Velocity (w_s): ${ws.toFixed(6)} m/s<br>
        <strong>Status:</strong><br>
        Erosion: ${erosionStatus}<br>
        Deposition: ${depositionStatus}
    `;
    document.getElementById("results-output").innerHTML = results;

    // Update chart
    updateChart(theta, thetaCr);
}

function updateChart(theta, thetaCr) {
    const ctx = document.getElementById("results-chart").getContext("2d");
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Shields Parameter (θ)', 'Critical Shields Parameter (θ_cr)'],
            datasets: [{
                label: 'Values',
                data: [theta, thetaCr],
                backgroundColor: ['#3498db', '#e74c3c']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
