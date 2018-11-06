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

  getLambda(hour){
    const sales = this.getSalesByHour(hour);
    let lambda = sales.length / 60; //cantidad de clientes que llegaron en esa hora (60 minutos)
    return lambda;
  },

  getProbabilityOfWaiting(hour, employees, mu){
    const lambda = this.getLambda(hour);
    const traficFactor = lambda / mu;
    if(employees == 1){
        return traficFactor;
    }
    if(employees == 2){
        return ((traficFactor ^ 2) / 2) * (2 / (2 - traficFactor)) * (1 - traficFactor);
    }
    if(employees == 3){
        return ((traficFactor ^ 3) / 6) * (3 / (3 - traficFactor)) * (1 - traficFactor);
    }
  },

  getProbabilityOfNoUnits(hour, employees, mu){
    const lambda = this.getLambda(hour);
    const traficFactor = lambda / mu;
    if(employees == 1){
        return 1 - traficFactor;
    }
    if (employees == 2) {
        return 1 / (((2 * traficFactor ^ 2 ) / (2 * (2 - traficFactor))) + (1 + traficFactor));
    }
    if (employees == 3) {
        return 1 / (((3 * traficFactor ^ 3) / (6 * ( 3 - traficFactor))) + (1 + traficFactor + ((traficFactor ^ 2 ) / 2)));
    }
  },

  getProbabilityOfKUnit(hour, employees, mu, k){
    const lambda = this.getLambda(hour);
    if(employees == 1){
        const i = k + 1;
        return (lambda / mu) ^ i;
    }else{
        return null;
    }
  },

  getAverageOfUnitsOnQueue(hour, employees, mu){
    const lambda = this.getLambda(hour);
    if(employees == 1){
        return (lambda ^ 2) / (mu * (mu - lambda));
    }else{
        return null;
    }
  },

  getAverageOfUnitsOnSystem(hour, employees, mu){
    const lambda = this.getLambda(hour);
    if(employees == 1){
        return lambda / (mu - lambda);
    }else{
        return null;
    }
  },

  getAverageTimeOfWaitingOnQueue(hour, employees, mu){
    const lambda = this.getLambda(hour);
    if(employees == 1){
        return lambda / (mu * (mu - lambda))
    }else{
        return null;
    }
  },

  getAverageTimeOfWaitingOnSystem(hour, employees, mu){
    const lambda = this.getLambda(hour);
    if(employees == 1){
        return 1 / (mu - lambda);
    }else{
        return null;
    }
  }

}