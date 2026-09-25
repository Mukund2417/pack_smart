# PackSmart: Scientific Data & Calculation Engines

This document specifies the scientific physical models, biochemical respiration equations, permeability calculations, and food property resolution rules implemented in PackSmart.

---

## 1. Critical Value Priority Rule (Sections 12 & 13)

For all calculations, every input parameter undergoes strict hierarchy resolution implemented in `backend/services/data_resolution_service.py`:

```
IF user provided value:
    Active Value = USER VALUE
    Source = "USER_SUPPLIED"
ELSE IF valid database / literature value exists:
    Active Value = DATABASE VALUE
    Source = "DATABASE" (or literature citation)
ELSE:
    Active Value = null
    Source = "UNKNOWN"
```

**Scientific Integrity Guarantee**: Under no circumstances does the engine silently replace or overwrite user-specified parameters with system defaults.

---

## 2. Produce Respiration Kinetics (Michaelis-Menten)

Fresh produce respiration consumes oxygen and releases carbon dioxide. Respiration rate as a function of oxygen concentration is modeled in `backend/engine/map_engine.py`:

$$R_{O_2} = \frac{V_m \cdot [O_2]}{K_m + [O_2]}$$

Where:
- $V_m$: Maximum respiration rate ($\text{mg } O_2/\text{kg}\cdot\text{hr}$).
- $K_m$: Michaelis-Menten affinity constant ($\% O_2$).
- $[O_2]$: Oxygen percentage in packaging headspace.

### Steady-State Equilibrium in MAP
At steady-state equilibrium, the rate of produce oxygen consumption equals the transmission rate of oxygen through the packaging film:

$$\text{Transmission} = \text{Consumption}$$
$$P_{O_2} \cdot A \cdot \frac{O_{2,\text{ambient}} - O_{2,\text{pkg}}}{100} = R(O_{2,\text{pkg}}) \cdot M \cdot \text{conversion factor}$$

Solved numerically using SciPy's non-linear solver (`scipy.optimize.fsolve`).

---

## 3. Barrier Permeability & Temperature Shift (Arrhenius Model)

Gas and water vapor transmission rates depend exponentially on storage temperature:

$$P(T) = P_{ref} \cdot \exp\left(-\frac{E_a}{R} \cdot \left(\frac{1}{T} - \frac{1}{T_{ref}}\right)\right)$$

Where:
- $P(T)$: Permeability at temperature $T$ (Kelvin).
- $P_{ref}$: Baseline permeability at standard test temperature ($23^\circ\text{C}$ for OTR, $37.8^\circ\text{C}$ for WVTR).
- $E_a$: Activation energy for permeation ($\text{kJ/mol}$).
- $R$: Universal gas constant ($8.314 \times 10^{-3} \text{ kJ/mol}\cdot\text{K}$).

---

## 4. Multilayer Laminate Permeability (Series Resistance Model)

For a multilayer composite film composed of $n$ distinct polymer plies, total permeance follows the harmonic resistance law:

$$\frac{1}{P_{total}} = \sum_{i=1}^{n} \frac{L_i}{P_i}$$

Where $L_i$ is thickness of layer $i$ and $P_i$ is intrinsic permeability. When an aluminum foil layer ($\ge 7\,\mu\text{m}$) or continuous vacuum metalized barrier is present, permeation approaches zero ($P_{total} \to 0$).

---

## 5. Multi-Criteria Decision Making (TOPSIS)

Candidate packaging materials are evaluated across competing criteria:
1. **Barrier Adequacy** (OTR & WVTR compatibility relative to commodity tolerance).
2. **Mechanical Puncture Resistance** (Newtons).
3. **Seal Integrity & Temperature Range**.
4. **Economic Cost Efficiency** (cost index per unit area).
5. **Circularity & LCA Carbon Footprint** (kg $\text{CO}_2\text{e}$ per kg material).

Normalization follows vector normalization:

$$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^m x_{kj}^2}}$$

Relative closeness to the ideal solution $C_i^*$ defines the final ranking score.

---

## 6. Official Regulatory and Testing Standards

- **ASTM D3985**: Standard Test Method for Oxygen Gas Transmission Rate Through Plastic Film Using a Coulometric Sensor.
- **ASTM F1249**: Standard Test Method for Water Vapor Transmission Rate Through Plastic Film Using a Modulated Infrared Sensor.
- **IS 9845 (India — FSSAI)**: Limits on overall migration for food contact plastics ($< 60\,\text{mg/kg}$ food stimulant).
- **EN 13432**: European standard for industrial compostability and biodegradable polymers.
