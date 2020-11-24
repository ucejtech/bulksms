class Formatter {
    static currency(bal: Number | String) {
        bal = Number(bal) / 100
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(Number(bal))
    }
}

export default Formatter