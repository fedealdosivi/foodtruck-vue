const sales=[
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
    if (num === 0){
        return 1; 
    }
    else{ 
        return num * rFact( num - 1 ); 
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
    switch(employees){
        default:
            result = traficFactor;
            break;

        case 2:
            result = ((traficFactor ^ 2) / 2) * (2 / (2 - traficFactor)) * (1 - traficFactor);
            break;

        case 3:
            result = ((traficFactor ^ 3) / 6) * (3 / (3 - traficFactor)) * (1 - traficFactor);
            break;
    }
    return result;
  },

  getProbabilityOfNoUnits(hour, employees, mu){
    let lambda = this.getLambda(hour);
    let traficFactor = lambda / mu;
    let result = 0;
    switch(employees){
        default:
            result = 1 - traficFactor;
            break;

        case 2:
            result = 1 / (((2 * traficFactor ^ 2 ) / (2 * (2 - traficFactor))) + (1 + traficFactor));
            break;

        case 3:
            result = 1 / (((3 * traficFactor ^ 3) / (6 * ( 3 - traficFactor))) + (1 + traficFactor + ((traficFactor ^ 2 ) / 2)));
            break;
    }
    return result;
  },

  getProbabilityOfKUnit(hour, employees, mu, k){
    let lambda = this.getLambda(hour);
    let traficFactor = (lambda / mu);
    let result = 0;
    switch(employees){
        default:
            let i = k + 1;
            result = traficFactor ^ i;
        break;

        case 2:
            result = ((traficFactor ^ k) / this.rFact(k)) * (k / (k - traficFactor)) * (1 - traficFactor);
        break;
    }
    return result;
  },

  getAverageOfUnitsOnQueue(hour, employees, mu){
    let lambda = this.getLambda(hour);
    let traficFactor = lambda / mu;
    let result = 0;
    switch(employees){
        default:
            result = (lambda ^ 2) / (mu * (mu - lambda));
            break;

        case 2:
            result = ((traficFactor ^ (employees + 1)) / (((employees - 1) * employees) * ((employees - traficFactor)^2))) * (1 - traficFactor);
            break;

        case 3:
            result = ((traficFactor ^ (employees + 1)) / (((employees - 1) * (employees - 2) * employees) * ((employees - traficFactor)^2))) * (1 - traficFactor);
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
        result = (getAverageOfUnitsOnQueue(hour, employees, mu)) + traficFactor;
    }
    return result;
  },

  getAverageTimeOfWaitingOnQueue(hour, employees, mu){
    let lambda = this.getLambda(hour);
    let result = 0;
    if(employees == 1){
        result = lambda / (mu * (mu - lambda))
    }else{
        result = (getAverageOfUnitsOnQueue(hour, employees, mu) / lambda);
    }
    return result;
  },

  getAverageTimeOfWaitingOnSystem(hour, employees, mu){
    let lambda = this.getLambda(hour);
    let result = 0;
    if(employees == 1){
        result = 1 / (mu - lambda);
    }else{
        result = (getAverageOfUnitsOnSystem(hour, employees, mu) / lambda);
    }
    return result;
  }

}