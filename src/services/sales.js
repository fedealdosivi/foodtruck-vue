const sales=[
    {
        "saleId": 1,
    },
    {
        "saleId": 2,
    },
    {
        "saleId": 3,
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
            if(s.cardId == id){
                filter.push(l);
            }
        });
        return filter;
  }
}