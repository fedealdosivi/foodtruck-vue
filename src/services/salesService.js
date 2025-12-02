let sales=[
    {
        "saleId": 1,
        "hour": "18:00"
    },
    {
        "saleId": 2,
        "hour": "19:00"
    },
    {
        "saleId": 3,
        "hour": "20:00"
    },
    {
        "saleId": 4,
        "hour": "18:00"
    },
    {
        "saleId": 5,
        "hour": "19:00"
    },
    {
        "saleId": 6,
        "hour": "20:00"
    },
    {
        "saleId": 7,
        "hour": "18:00"
    },
    {
        "saleId": 8,
        "hour": "19:00"
    },
    {
        "saleId": 9,
        "hour": "20:00"
    },
    {
        "saleId": 10,
        "hour": "18:00"
    },
    {
        "saleId": 11,
        "hour": "19:00"
    },
    {
        "saleId": 12,
        "hour": "20:00"
    },
    {
        "saleId": 13,
        "hour": "18:00"
    },
    {
        "saleId": 14,
        "hour": "19:00"
    },
    {
        "saleId": 15,
        "hour": "20:00"
    },
    {
        "saleId": 16,
        "hour": "18:00"
    },
    {
        "saleId": 17,
        "hour": "19:00"
    },
    {
        "saleId": 18,
        "hour": "20:00"
    },
        {
        "saleId": 19,
        "hour": "20:00"
    },
    {
        "saleId": 20,
        "hour": "18:00"
    },
    {
        "saleId": 21,
        "hour": "19:00"
    },
    {
        "saleId": 22,
        "hour": "20:00"
    },
    {
        "saleId": 23,
        "hour": "18:00"
    },
    {
        "saleId": 24,
        "hour": "19:00"
    },
    {
        "saleId": 25,
        "hour": "20:00"
    }
]
export default{
  getSales(){
    return sales; 
  },

  getSaleById(id){
    const sales = this.getSales();
        let filter = [];
        sales.forEach(function(s) {
            if(s.saleId == id){
                filter.push(s);
            }
        });
        return filter;
  },

  getSalesByHour(hour){
    const sales = this.getSales();
    let filter = [];
        sales.forEach(function(s) {
            if(s.hour == hour){
                filter.push(s);
            }
        });
        return filter;
  },

  rFact(num){
    if (num === 0 || num === 1){
        return 1;
    }
    else{
        return num * this.rFact(num - 1);
    }
  },

  getLambda(hour){
    const sales = this.getSalesByHour(hour);
    let lambda = sales.length / 60; //cantidad de clientes que llegaron en esa hora (60 minutos)
    return lambda;
  },

  getProbabilityOfWaiting(hour, employees, mu){
    let lambda = this.getLambda(hour);
    let traficFactor = lambda / mu;
    let result = 0;
    let P0 = this.getProbabilityOfNoUnits(hour, employees, mu);

    switch(employees){
        case 1:
            result = traficFactor;
            break;

        case 2:
            result = (Math.pow(traficFactor, 2) / 2) * (2 / (2 - traficFactor)) * P0;
            break;

        case 3:
            result = (Math.pow(traficFactor, 3) / 6) * (3 / (3 - traficFactor)) * P0;
            break;

        default:
            result = traficFactor;
            break;
    }
    return result;
  },

  getProbabilityOfNoUnits(hour, employees, mu){
    let lambda = this.getLambda(hour);
    let traficFactor = lambda / mu;
    let result = 0;

    switch(employees){
        case 1:
            result = 1 - traficFactor;
            break;

        case 2:
            result = 1 / (((2 * Math.pow(traficFactor, 2)) / (2 * (2 - traficFactor))) + (1 + traficFactor));
            break;

        case 3:
            result = 1 / (((3 * Math.pow(traficFactor, 3)) / (6 * (3 - traficFactor))) + (1 + traficFactor + (Math.pow(traficFactor, 2) / 2)));
            break;

        default:
            result = 1 - traficFactor;
            break;
    }
    return result;
  },

  getProbabilityOfKUnit(hour, employees, mu, k){
    let lambda = this.getLambda(hour);
    let traficFactor = (lambda / mu);
    let result = 0;
    let P0 = this.getProbabilityOfNoUnits(hour, employees, mu);

    switch(employees){
        case 1:
            result = Math.pow(traficFactor, k) * (1 - traficFactor);
            break;

        case 2:
            if (k <= employees) {
                result = (Math.pow(traficFactor, k) / this.rFact(k)) * P0;
            } else {
                result = (Math.pow(traficFactor, k) / (Math.pow(employees, k - employees) * this.rFact(employees))) * P0;
            }
            break;

        case 3:
            if (k <= employees) {
                result = (Math.pow(traficFactor, k) / this.rFact(k)) * P0;
            } else {
                result = (Math.pow(traficFactor, k) / (Math.pow(employees, k - employees) * this.rFact(employees))) * P0;
            }
            break;

        default:
            result = Math.pow(traficFactor, k) * (1 - traficFactor);
            break;
    }
    return result;
  },

  getAverageOfUnitsOnQueue(hour, employees, mu){
    let lambda = this.getLambda(hour);
    let traficFactor = lambda / mu;
    let result = 0;
    let P0 = this.getProbabilityOfNoUnits(hour, employees, mu);

    switch(employees){
        case 1:
            result = Math.pow(lambda, 2) / (mu * (mu - lambda));
            break;

        case 2:
            result = (Math.pow(traficFactor, employees + 1) / (this.rFact(employees - 1) * Math.pow(employees - traficFactor, 2))) * P0;
            break;

        case 3:
            result = (Math.pow(traficFactor, employees + 1) / (this.rFact(employees - 1) * Math.pow(employees - traficFactor, 2))) * P0;
            break;

        default:
            result = Math.pow(lambda, 2) / (mu * (mu - lambda));
            break;
    }
    return result;
  },

  getAverageOfUnitsOnSystem(hour, employees, mu){
    let lambda = this.getLambda(hour);
    let traficFactor = lambda / mu;
    let result = 0;
    if(employees == 1){
        result = lambda / (mu - lambda);
    }else{
        result = this.getAverageOfUnitsOnQueue(hour, employees, mu) + traficFactor;
    }
    return result;
  },

  getAverageTimeOfWaitingOnQueue(hour, employees, mu){
    let lambda = this.getLambda(hour);
    let result = 0;
    if(employees == 1){
        result = lambda / (mu * (mu - lambda));
    }else{
        result = this.getAverageOfUnitsOnQueue(hour, employees, mu) / lambda;
    }
    return result;
  },

  getAverageTimeOfWaitingOnSystem(hour, employees, mu){
    let lambda = this.getLambda(hour);
    let result = 0;
    if(employees == 1){
        result = 1 / (mu - lambda);
    }else{
        result = this.getAverageOfUnitsOnSystem(hour, employees, mu) / lambda;
    }
    return result;
  },

  getRecommendedEmployees(hour, mu, maxWaitTime = 5){
    let lambda = this.getLambda(hour);

    for(let employees = 1; employees <= 3; employees++){
      let avgWaitTime = this.getAverageTimeOfWaitingOnQueue(hour, employees, mu);
      let probWaiting = this.getProbabilityOfWaiting(hour, employees, mu);
      let utilizationRate = (lambda / (employees * mu));

      if(avgWaitTime <= maxWaitTime && utilizationRate < 0.85 && utilizationRate > 0.5){
        return {
          recommended: employees,
          avgWaitTime: avgWaitTime.toFixed(2),
          probWaiting: (probWaiting * 100).toFixed(2),
          utilizationRate: (utilizationRate * 100).toFixed(2)
        };
      }
    }

    return {
      recommended: 3,
      avgWaitTime: this.getAverageTimeOfWaitingOnQueue(hour, 3, mu).toFixed(2),
      probWaiting: (this.getProbabilityOfWaiting(hour, 3, mu) * 100).toFixed(2),
      utilizationRate: ((lambda / (3 * mu)) * 100).toFixed(2)
    };
  },

  getAllHoursAnalysis(mu){
    const hours = ['18:00', '19:00', '20:00'];
    return hours.map(hour => {
      let lambda = this.getLambda(hour);
      let salesCount = this.getSalesByHour(hour).length;
      let recommendation = this.getRecommendedEmployees(hour, mu);

      return {
        hour,
        salesCount,
        lambda: lambda.toFixed(3),
        ...recommendation
      };
    });
  },

  addSale(hour){
    const newSaleId = sales.length > 0 ? Math.max(...sales.map(s => s.saleId)) + 1 : 1;
    const newSale = {
      saleId: newSaleId,
      hour: hour
    };
    sales.push(newSale);
    return newSale;
  },

  deleteSale(saleId){
    const index = sales.findIndex(s => s.saleId === saleId);
    if(index !== -1){
      sales.splice(index, 1);
      return true;
    }
    return false;
  }

}