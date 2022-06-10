﻿abstract class Chart {
    protected readonly canvas: HTMLCanvasElement;
    protected readonly ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    abstract draw(): void;

    public randomColor(seed: number): string {
        if (seed < 1) {
            seed = 1;
        }
        const hue = seed * 137.508; // using golden angle approximation
        return `hsl(${hue}, 100%, 75%)`;
    }
}

class PieChart extends Chart {
    private readonly _data: Map<string, number>;

    constructor(canvasElement: HTMLCanvasElement, data: Map<string, number>) {
        super(canvasElement);
        this._data = data;
    }

    public draw() {
        let totalValue = 0;

        for (var categ in this._data) {
            const val = this._data[categ];
            totalValue += val;
        }

        let startAngle = 0;
        let colorIndex = 1;

        for (categ in this._data) {
            const val = this._data[categ];
            const sliceAngle = 2 * Math.PI * val / totalValue;
            const endAngle = startAngle + sliceAngle;
            const color = this.randomColor(colorIndex);
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const radius = Math.min(centerX, centerY);

            this.drawPieSlice(centerX, centerY, radius, startAngle, endAngle, color);
            this.drawPieLabel(val, totalValue, startAngle, sliceAngle);

            startAngle += sliceAngle;
            colorIndex++;
        }
    }

    private drawPieLabel(value: number, totalValue: number, startAngle: number, sliceAngle: number) {
        const pieRadius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
        const labelX = this.canvas.width / 2 + (pieRadius / 2) * Math.cos(startAngle + sliceAngle / 2);
        const labelY = this.canvas.height / 2 + (pieRadius / 2) * Math.sin(startAngle + sliceAngle / 2);

        const labelText = Math.round(100 * value / totalValue);
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 20px Arial";
        this.ctx.fillText(labelText + "%", labelX, labelY);
    }

    private drawPieSlice(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.ctx.closePath();
        this.ctx.fill();
    }

    //private drawLine(startX: number, startY: number, endX: number, endY: number) {
    //    this.ctx.beginPath();
    //    this.ctx.moveTo(startX, startY);
    //    this.ctx.lineTo(endX, endY);
    //    this.ctx.stroke();
    //}

    //private drawArc(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
    //    this.ctx.beginPath();
    //    this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    //    this.ctx.stroke();
    //}
}