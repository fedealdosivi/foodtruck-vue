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
  }

  getSalesByHour(hour){
    const sales = this.getSales();
    let filter = [];
        sales.forEach(function(s) {
            if(s.hour == hour){
                filter.push(s);
            }
        });
        return filter;
  }
}