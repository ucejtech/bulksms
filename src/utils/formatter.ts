class Formatter {
  static currency(bal: number | string) {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(Number(Number(bal) / 100));
  }
}

export default Formatter;
