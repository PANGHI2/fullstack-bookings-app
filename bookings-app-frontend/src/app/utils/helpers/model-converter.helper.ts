type ConvertFn<A, B> = (a: A) => B;

export class ModelConverter<A, B> {
    private readonly convertFn: ConvertFn<A, B>;

    constructor(convertFn: ConvertFn<A, B>) {
        this.convertFn = convertFn;
    }

    convert(input: A[]): B[];

    convert(input: A): B;

    convert(input: any): any {
        if (Array.isArray(input)) {
            return input.map((item) => this.convert(item));
        } else {
            return this.convertFn(input);
        }
    }
}
