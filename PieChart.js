/**
 * Created by lasse on 22/01/2017.
 */
var PieChart = function(elementId, data) {

    this.c = document.getElementById(elementId);
    this.ctx = this.c.getContext("2d");
    this.circleCenter = this.c.width / 3;
    this.data = data;
    this.dataSum = function() {
        var total = 0;
        for (var i = 0; i < data.length; i++) {
            total += data[i];
        }
        return total;
    }();

    this.options = {
        colors: ["#090", "#095", "#0A0", "#0A5", "#900", "#950", "#A00", "#A50", "#009", "#059"],
        radius: 100,
        labels: {
                names: ["Marketing", "Collaboration", "Social Media", "E-mail", "Cloud Storage", "HR", "Business Intelligence", "Messengers", "Streaming", "Travel"],
                xStart: this.circleCenter + this.radius + 20,
                yStart: this.c.width / 2
            }
        };

    this.drawSegment = function(cx, cy, procent, index) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#FFF";
        this.ctx.lineTo(cx, cy);
        this.ctx.arc(cx, cy, this.options.radius, 0, Math.PI*(2 - (2 * procent)), true);
        this.ctx.lineTo(cx,cy);
        this.ctx.fillStyle = this.options.colors[index];
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    };

    this.rotate = function(cx, cy, procent) {
        this.ctx.translate(cx, cy);
        this.ctx.rotate(Math.PI*(2 - (2 * procent)));
        this.ctx.translate(-cx, -cy);
    };

    this.drawLabel = function(x, y, color, name) {

        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 10, 10);
        this.ctx.fillText(name, x + 20, y + 8);
        this.ctx.closePath();

    };

    this.drawPie = function() {
        for (var i = 0; i < this.data.length; i++) {
            var procent = this.data[i] / this.dataSum;
            console.log({p: procent, s: this.dataSum, d: this.data});
            this.drawSegment(this.c.width / 3, this.c.height / 2, procent, i);
            this.rotate(this.c.width / 3, this.c.height / 2, procent);
        }
    };

    this.drawLabels = function() {
        var xLabel = this.circleCenter + this.options.radius + 20;
        var yLabel = (this.c.height / 2) - this.options.radius + (this.options.radius * 0.25);

        for (var j = 0; j < this.data.length; j++) {
            this.drawLabel(xLabel, yLabel, this.options.colors[j], this.options.labels.names[j]);
            yLabel += 15;
        }
    };

    this.draw = function() {

        this.drawPie();
        this.drawLabels();

    }
};

// draw arc
// draw lines
// fill