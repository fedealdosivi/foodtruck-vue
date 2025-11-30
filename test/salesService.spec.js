import salesService from '../src/services/salesService';

describe('SalesService', () => {

  describe('getSales', () => {
    test('should return all sales data', () => {
      const sales = salesService.getSales();
      expect(sales).toBeDefined();
      expect(Array.isArray(sales)).toBe(true);
      expect(sales.length).toBe(25);
    });

    test('each sale should have saleId and hour properties', () => {
      const sales = salesService.getSales();
      sales.forEach(sale => {
        expect(sale).toHaveProperty('saleId');
        expect(sale).toHaveProperty('hour');
      });
    });
  });

  describe('getSaleById', () => {
    test('should return sale with matching id', () => {
      const result = salesService.getSaleById(1);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0].saleId).toBe(1);
    });

    test('should return empty array for non-existent id', () => {
      const result = salesService.getSaleById(999);
      expect(result).toEqual([]);
    });
  });

  describe('getSalesByHour', () => {
    test('should return sales for 18:00', () => {
      const result = salesService.getSalesByHour('18:00');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      result.forEach(sale => {
        expect(sale.hour).toBe('18:00');
      });
    });

    test('should return sales for 19:00', () => {
      const result = salesService.getSalesByHour('19:00');
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      result.forEach(sale => {
        expect(sale.hour).toBe('19:00');
      });
    });

    test('should return sales for 20:00', () => {
      const result = salesService.getSalesByHour('20:00');
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      result.forEach(sale => {
        expect(sale.hour).toBe('20:00');
      });
    });

    test('should return empty array for non-existent hour', () => {
      const result = salesService.getSalesByHour('12:00');
      expect(result).toEqual([]);
    });
  });

  describe('rFact (factorial)', () => {
    test('should return 1 for 0', () => {
      expect(salesService.rFact(0)).toBe(1);
    });

    test('should return 1 for 1', () => {
      expect(salesService.rFact(1)).toBe(1);
    });

    test('should calculate factorial correctly', () => {
      expect(salesService.rFact(2)).toBe(2);
      expect(salesService.rFact(3)).toBe(6);
      expect(salesService.rFact(4)).toBe(24);
      expect(salesService.rFact(5)).toBe(120);
    });
  });

  describe('getLambda (arrival rate)', () => {
    test('should return positive lambda for valid hour', () => {
      const lambda = salesService.getLambda('18:00');
      expect(lambda).toBeGreaterThan(0);
      expect(typeof lambda).toBe('number');
    });

    test('should calculate lambda based on sales per 60 minutes', () => {
      const sales = salesService.getSalesByHour('18:00');
      const expectedLambda = sales.length / 60;
      const actualLambda = salesService.getLambda('18:00');
      expect(actualLambda).toBeCloseTo(expectedLambda, 5);
    });

    test('should return 0 for hour with no sales', () => {
      const lambda = salesService.getLambda('12:00');
      expect(lambda).toBe(0);
    });
  });

  describe('getProbabilityOfWaiting', () => {
    const testHour = '18:00';
    const mu = 0.30;

    test('should return probability between 0 and 1', () => {
      for (let employees = 1; employees <= 3; employees++) {
        const prob = salesService.getProbabilityOfWaiting(testHour, employees, mu);
        expect(prob).toBeGreaterThanOrEqual(0);
        expect(prob).toBeLessThanOrEqual(1);
      }
    });

    test('should decrease with more employees', () => {
      const prob1 = salesService.getProbabilityOfWaiting(testHour, 1, mu);
      const prob2 = salesService.getProbabilityOfWaiting(testHour, 2, mu);
      const prob3 = salesService.getProbabilityOfWaiting(testHour, 3, mu);

      expect(prob2).toBeLessThan(prob1);
      expect(prob3).toBeLessThan(prob2);
    });

    test('should return valid number', () => {
      const prob = salesService.getProbabilityOfWaiting(testHour, 2, mu);
      expect(typeof prob).toBe('number');
      expect(isNaN(prob)).toBe(false);
    });
  });

  describe('getProbabilityOfNoUnits', () => {
    const testHour = '18:00';
    const mu = 0.30;

    test('should return probability between 0 and 1', () => {
      for (let employees = 1; employees <= 3; employees++) {
        const prob = salesService.getProbabilityOfNoUnits(testHour, employees, mu);
        expect(prob).toBeGreaterThanOrEqual(0);
        expect(prob).toBeLessThanOrEqual(1);
      }
    });

    test('should increase with more employees (less busy)', () => {
      const prob1 = salesService.getProbabilityOfNoUnits(testHour, 1, mu);
      const prob2 = salesService.getProbabilityOfNoUnits(testHour, 2, mu);
      const prob3 = salesService.getProbabilityOfNoUnits(testHour, 3, mu);

      expect(prob2).toBeGreaterThan(prob1);
      expect(prob3).toBeGreaterThan(prob2);
    });
  });

  describe('getProbabilityOfKUnit', () => {
    const testHour = '18:00';
    const mu = 0.30;

    test('should return valid probability for different k values', () => {
      for (let k = 0; k <= 5; k++) {
        const prob = salesService.getProbabilityOfKUnit(testHour, 2, mu, k);
        expect(prob).toBeGreaterThanOrEqual(0);
        expect(typeof prob).toBe('number');
        expect(isNaN(prob)).toBe(false);
      }
    });

    test('should handle different employee counts', () => {
      const k = 2;
      for (let employees = 1; employees <= 3; employees++) {
        const prob = salesService.getProbabilityOfKUnit(testHour, employees, mu, k);
        expect(typeof prob).toBe('number');
        expect(isNaN(prob)).toBe(false);
      }
    });
  });

  describe('getAverageOfUnitsOnQueue', () => {
    const testHour = '18:00';
    const mu = 0.30;

    test('should return non-negative average', () => {
      for (let employees = 1; employees <= 3; employees++) {
        const avg = salesService.getAverageOfUnitsOnQueue(testHour, employees, mu);
        expect(avg).toBeGreaterThanOrEqual(0);
      }
    });

    test('should decrease with more employees', () => {
      const avg1 = salesService.getAverageOfUnitsOnQueue(testHour, 1, mu);
      const avg2 = salesService.getAverageOfUnitsOnQueue(testHour, 2, mu);
      const avg3 = salesService.getAverageOfUnitsOnQueue(testHour, 3, mu);

      expect(avg2).toBeLessThan(avg1);
      expect(avg3).toBeLessThan(avg2);
    });
  });

  describe('getAverageOfUnitsOnSystem', () => {
    const testHour = '18:00';
    const mu = 0.30;

    test('should return non-negative average', () => {
      for (let employees = 1; employees <= 3; employees++) {
        const avg = salesService.getAverageOfUnitsOnSystem(testHour, employees, mu);
        expect(avg).toBeGreaterThanOrEqual(0);
      }
    });

    test('should be greater than or equal to queue average', () => {
      for (let employees = 1; employees <= 3; employees++) {
        const avgQueue = salesService.getAverageOfUnitsOnQueue(testHour, employees, mu);
        const avgSystem = salesService.getAverageOfUnitsOnSystem(testHour, employees, mu);
        expect(avgSystem).toBeGreaterThanOrEqual(avgQueue);
      }
    });
  });

  describe('getAverageTimeOfWaitingOnQueue', () => {
    const testHour = '18:00';
    const mu = 0.30;

    test('should return non-negative time', () => {
      for (let employees = 1; employees <= 3; employees++) {
        const time = salesService.getAverageTimeOfWaitingOnQueue(testHour, employees, mu);
        expect(time).toBeGreaterThanOrEqual(0);
      }
    });

    test('should decrease with more employees', () => {
      const time1 = salesService.getAverageTimeOfWaitingOnQueue(testHour, 1, mu);
      const time2 = salesService.getAverageTimeOfWaitingOnQueue(testHour, 2, mu);
      const time3 = salesService.getAverageTimeOfWaitingOnQueue(testHour, 3, mu);

      expect(time2).toBeLessThan(time1);
      expect(time3).toBeLessThan(time2);
    });
  });

  describe('getAverageTimeOfWaitingOnSystem', () => {
    const testHour = '18:00';
    const mu = 0.30;

    test('should return non-negative time', () => {
      for (let employees = 1; employees <= 3; employees++) {
        const time = salesService.getAverageTimeOfWaitingOnSystem(testHour, employees, mu);
        expect(time).toBeGreaterThanOrEqual(0);
      }
    });

    test('should be greater than or equal to queue wait time', () => {
      for (let employees = 1; employees <= 3; employees++) {
        const timeQueue = salesService.getAverageTimeOfWaitingOnQueue(testHour, employees, mu);
        const timeSystem = salesService.getAverageTimeOfWaitingOnSystem(testHour, employees, mu);
        expect(timeSystem).toBeGreaterThanOrEqual(timeQueue);
      }
    });
  });

  describe('getRecommendedEmployees', () => {
    const testHour = '18:00';
    const mu = 0.30;

    test('should return recommendation object with required properties', () => {
      const recommendation = salesService.getRecommendedEmployees(testHour, mu);

      expect(recommendation).toHaveProperty('recommended');
      expect(recommendation).toHaveProperty('avgWaitTime');
      expect(recommendation).toHaveProperty('probWaiting');
      expect(recommendation).toHaveProperty('utilizationRate');
    });

    test('should recommend between 1 and 3 employees', () => {
      const recommendation = salesService.getRecommendedEmployees(testHour, mu);
      expect(recommendation.recommended).toBeGreaterThanOrEqual(1);
      expect(recommendation.recommended).toBeLessThanOrEqual(3);
    });

    test('should return formatted string values', () => {
      const recommendation = salesService.getRecommendedEmployees(testHour, mu);

      expect(typeof recommendation.avgWaitTime).toBe('string');
      expect(typeof recommendation.probWaiting).toBe('string');
      expect(typeof recommendation.utilizationRate).toBe('string');
    });

    test('should handle different service rates', () => {
      const rec1 = salesService.getRecommendedEmployees(testHour, 0.20);
      const rec2 = salesService.getRecommendedEmployees(testHour, 0.40);

      expect(rec1).toBeDefined();
      expect(rec2).toBeDefined();
    });
  });

  describe('getAllHoursAnalysis', () => {
    const mu = 0.30;

    test('should return analysis for all hours', () => {
      const analysis = salesService.getAllHoursAnalysis(mu);

      expect(Array.isArray(analysis)).toBe(true);
      expect(analysis.length).toBe(3);
    });

    test('each analysis should have required properties', () => {
      const analysis = salesService.getAllHoursAnalysis(mu);

      analysis.forEach(hourData => {
        expect(hourData).toHaveProperty('hour');
        expect(hourData).toHaveProperty('salesCount');
        expect(hourData).toHaveProperty('lambda');
        expect(hourData).toHaveProperty('recommended');
        expect(hourData).toHaveProperty('avgWaitTime');
        expect(hourData).toHaveProperty('probWaiting');
        expect(hourData).toHaveProperty('utilizationRate');
      });
    });

    test('should include all time slots', () => {
      const analysis = salesService.getAllHoursAnalysis(mu);
      const hours = analysis.map(a => a.hour);

      expect(hours).toContain('18:00');
      expect(hours).toContain('19:00');
      expect(hours).toContain('20:00');
    });

    test('sales count should match actual sales', () => {
      const analysis = salesService.getAllHoursAnalysis(mu);

      analysis.forEach(hourData => {
        const actualSales = salesService.getSalesByHour(hourData.hour);
        expect(hourData.salesCount).toBe(actualSales.length);
      });
    });
  });

  describe('Integration - Queuing Theory Properties', () => {
    const testHour = '18:00';
    const mu = 0.30;

    test('Little\'s Law: L = λW should hold for system', () => {
      const lambda = salesService.getLambda(testHour);
      const employees = 2;

      const L = salesService.getAverageOfUnitsOnSystem(testHour, employees, mu);
      const W = salesService.getAverageTimeOfWaitingOnSystem(testHour, employees, mu);

      const littlesLaw = lambda * W;
      expect(L).toBeCloseTo(littlesLaw, 2);
    });

    test('Little\'s Law: Lq = λWq should hold for queue', () => {
      const lambda = salesService.getLambda(testHour);
      const employees = 2;

      const Lq = salesService.getAverageOfUnitsOnQueue(testHour, employees, mu);
      const Wq = salesService.getAverageTimeOfWaitingOnQueue(testHour, employees, mu);

      const littlesLaw = lambda * Wq;
      expect(Lq).toBeCloseTo(littlesLaw, 2);
    });

    test('traffic intensity should be less than 1 for stable system', () => {
      const lambda = salesService.getLambda(testHour);
      const employees = 2;

      const rho = lambda / (employees * mu);
      expect(rho).toBeLessThan(1);
    });
  });
});
