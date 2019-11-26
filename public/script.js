// b358ebe24087cb84da27a37eb47b8386950eda0648e2d84f5300e04ef3d9c342

// Vue.prototype.$http = axios;

var LOAD_NUM = 4;
var watcher;

    new Vue({
        el: "#app",
        data: {
            total: 10,
            products: [	],
            cart: [],
            search: "cat",
            searchAxios: "",
            lastSearch: "",
            loading: false,
            results: []
        },
        methods: {
            addToCart: function(product) {
                this.total += product.price;
                let found = false;
                for (let i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === product.id) {
                        this.cart[i].qty++;
                        found = true;
                    }
                    
                }
                if (!found) {
                    this.cart.push({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        qty:1
                    });    
                }
            },
            inc: function(item) {
                item.qty++;
                this.total += item.price;
            },
            decr: function(item) {
                item.qty--;
                this.total -= item.price;
                if (item.qty <= 0) {
                    var i = this.cart.indexOf(item);
                    this.cart.splice(i,1);
                }
            },
            onSubmit() {
                let path ="/search?q=".concat(this.search)
                this.products = []
                this.results = []
                this.loading = true
                this.$http.get(path)
                    .then(function (response) {
                        setTimeout(() => {
                            console.log(response);
                            this.results = response.body;
                            this.lastSearch = this.search;   
                            this.appendResults()
                            this.loading = false            
                        }, 1500);
                    });
            },
            appendResults() {
                if (this.products.length < this.results.length) {
                    let toAppend = this.results.slice(
                        this.products.length, 
                        LOAD_NUM + this.products.length)
                    this.products = this.products.concat(toAppend)
                }
            }
        },
        filters: {
            currency: function (price) {
                return "$".concat(price.toFixed(2));
            }
        },
        created() {
            this.onSubmit()
        },
        updated() {
            var sensor = document.querySelector("#product-list-bottom")
            watcher = scrollMonitor.create(sensor);
    
            watcher.enterViewport(this.appendResults)
        },
        beforeUpdate() {
            if (watcher) {
                watcher.destroy()
                watcher = null
            }
        },
    });
