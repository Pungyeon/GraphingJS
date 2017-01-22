var ColumnGraph = function(canvas, graphData) {

    var options = {
        transformY: 0.6,
        transformX: 0.8,
        transform: 0.6,
        columnColors: ["#090", "#fb5", "#900"],
        title: "Service Distribution",
        grid: {
            lineFormat: "vertical",
            yMargin: 1.20
        },
        labels: {
            labelsX: ["Low", "Medium", "High"],
            labelsY: false
        },
        margin: 30,
        font: {
            family: "Arial",
            size: "10px"
        }

    };

    this.options = options;

    this.c = document.getElementById(canvas);
    this.ctx = this.c.getContext('2d');
    this.data = graphData; // check somehow that this is an array

    this.minY = this.c.height * ((1 - options.transformY) / 2) + (this.c.height * 0.05);
    this.maxY = (this.c.height * options.transformY) + this.minY;

    this.minX = this.c.width * ((1 - options.transformX) / 2);
    this.maxX = (this.c.width * options.transformX) + this.minX;

    this.width = this.maxX - this.minX;
    this.height = this.maxY - this.minY;

    this.maxData = function() {
        var tmpValue = 0;
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i] > tmpValue) {
                tmpValue = this.data[i];

            }
        }
        return tmpValue * this.options.grid.yMargin;
    };

    this.drawColumn = function(x, y, dx, dy, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, dx, dy);
        this.ctx.closePath();
    };

    this.drawDataLabel = function(x, y, data) {

        var label = data.toString();
        var correctedX = x - ((label.length / 2) * 5);

        this.ctx.beginPath();
        this.ctx.fillStyle = "#444";
        this.ctx.font = this.options.font.size + " " + this.options.font.family;
        this.ctx.fillText(label, correctedX, y - 4);
        this.ctx.closePath();
    };

    this.drawHorizontalGridLine = function(y) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.minX, y);
        this.ctx.lineTo(this.maxX, y);
        this.ctx.lineWidth = 0.25;
        this.ctx.strokeStyle = "#999";
        this.ctx.stroke();
        this.ctx.closePath();
    };

    this.drawVerticalGridLine = function(x, style, linewidth) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = style;
        this.ctx.lineWidth = linewidth;
        this.ctx.moveTo(x, this.minY);
        this.ctx.lineTo(x, this.maxY + (this.c.height * 0.1));
        this.ctx.stroke();
        this.ctx.closePath();
    };

    this.drawGridLabel = function(y, data) {

        var label = data.toFixed(0).toString();

        this.ctx.beginPath();
        this.ctx.fillStyle = "#777";
        this.ctx.fillText(label, this.minX - 5 - (label.length * 5), y + 2.5);
        this.ctx.closePath();
    };

    // draw horizontal grid lines
    this.drawGrid = function() {
        if (this.options.grid.lineFormat === 'vertical') {
            var segmentWidth = this.width / this.data.length;
            var currentX = this.minX;

            this.drawVerticalGridLine(this.minX, "#999", 0.5);
            this.drawVerticalGridLine(this.maxX, "#999", 0.5);
            this.drawHorizontalGridLine(this.maxY);



            for (var i = 0; i < this.data.length - 1; i++) {
                this.drawVerticalGridLine(currentX + segmentWidth, "#BBB", 0.25);
                currentX += segmentWidth;
            }

        } else {
            var gridLines = this.height / 10;
            var dataSegment = this.maxData() / 10;
            var gridY = this.maxY;
            var gridData = 0;
            for (var i = 0; i < 11; i++) {
                this.drawVerticalGridLine(gridY);
                if (this.options.grid.labelsY === true) this.drawGridLabel(gridY, gridData);
                gridY -= gridLines;
                gridData += dataSegment;
            }
        }
    };

    this.drawLabelsX = function(x, text) {
        this.ctx.beginPath();
        this.ctx.font = this.options.font.size + " " + this.options.font.family;
        this.ctx.fillStyle = "#777";
        this.ctx.fillText(text, x - ((text.length / 2) * 5), this.maxY + (this.c.height * 0.08));
        this.ctx.closePath();
    };

    this.drawData = function() {

        var segmentWidth = this.width / (this.data.length);

        var startingX = this.minX + (this.options.margin / 2);
        for (var i = 0; i < this.data.length; i++) {
            var tmpProcent = this.data[i] / this.maxData();
            var color = i > (this.options.columnColors.length - 1) ? "#777" : this.options.columnColors[i];
            var labelX = i > (this.options.labels.labelsX.length - 1) ? "": this.options.labels.labelsX[i];
            this.drawColumn(startingX, this.maxY, segmentWidth - this.options.margin, -(tmpProcent * this.height), color);
            this.drawDataLabel(startingX + ((segmentWidth - (this.options.margin)) / 2), this.minY + ((1 - tmpProcent) * this.height), this.data[i]);
            this.drawLabelsX(startingX + ((segmentWidth - (this.options.margin)) / 2), labelX);
            startingX += segmentWidth;
        }
    };

    this.drawTitle = function() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#777";
        this.ctx.font = "12px " + this.options.font.family;
        this.ctx.fillText(this.options.title, (this.c.width / 2) - this.options.title.length * 2.5, this.minY / 3);
        this.ctx.closePath();
    };

    // main
    this.draw = function() {
        this.drawGrid();
        this.drawData();
        this.drawTitle();
    };
};
