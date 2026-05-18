export default function decimalToRgb(int: number) {
    return {
        b: int & 0xFF,
        g: (int >> 8) & 0xFF,
        r: (int >> 16) & 0xFF
    };
}