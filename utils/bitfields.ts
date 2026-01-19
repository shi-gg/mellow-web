export class BitfieldManager {
    constructor(private flags: number) {}

    add(flag: number) {
        if (this.has(flag)) return;
        this.flags |= flag;
    }

    remove(flag: number) {
        if (!this.has(flag)) return;
        this.flags &= ~flag;
    }

    has(flag: number) {
        return (this.flags & flag) === flag;
    }

    get() {
        return this.flags;
    }

    toArray() {
        const flags: number[] = [];
        let field = this.flags;
        let bit = 1;

        while (field > 0) {
            if (field & bit) {
                flags.push(bit);
                field -= bit;
            }
            bit <<= 1;
        }

        return flags;
    }
}

export function bitfieldToArray(bitfield: Record<string | number, string | number>) {
    return Object.entries(bitfield)
        .filter(([_, value]) => typeof value === "number")
        .map(([name, value]) => ({
            name: name.replace(/[a-z][A-Z]/g, (s) => s[0] + " " + s[1]),
            value
        }));
}

export function arrayToBitfield(array: (number | string)[], obj: Record<string | number, string | number>, flags: number) {
    const bits = array
        .map(Number)
        .reduce((a, b) => a | b, 0);

    const mask = Object.values(obj)
        .filter((v): v is number => typeof v === "number")
        .reduce((a, b) => a | b, 0);

    return (flags & ~mask) | bits;
}

export function transformer(value: boolean, flags: number, flag: number) {
    return value ? flags | flag : flags & ~flag;
}