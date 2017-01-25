var BarGraph = function(canvas, data) {

    this.options = {
        transformY: 0.7,
        transformX: 0.8,
        transform: 0.6,
        barColors: ["#468"],
        title: "Service Distribution",
        grid: {
            lineFormat: "vertical",
            yMargin: 1.20
        },
        labels: {
            labelsX: ["Low", "Medium", "High", "Something", "Else"],
            labelsY: false
        },
        margin: 10,
        font: {
            family: "Arial",
            size: "10px"
        }

    };

    this.c = document.getElementById(canvas);
    this.ctx = this.c.getContext('2d');
    this.data = data;

    this.minY = this.c.height * ((1 - this.options.transformY) / 2) + (this.c.height * 0.05);
    this.maxY = (this.c.height * this.options.transformY) + this.minY;

    this.minX = this.c.width * ((1 - this.options.transformX) / 2);
    this.maxX = (this.c.width * this.options.transformX) + this.minX;

    this.width = this.maxX - this.minX;
    this.height = this.maxY - this.minY;

    this.maxData = function() {
      var tmpValue = 0;
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i] > tmpValue) tmpValue = this.data[i];
      }
      return tmpValue * 2;
    }();

    this.drawGridLine = function(y) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.minX, y);
      this.ctx.lineTo(this.maxX, y);
      this.ctx.strokeStyle = "#DDD";
      this.ctx.stroke();
      this.ctx.closePath();
    };

    this.drawLabel = function(x, y, height, index) {
      // draw grid labels:
      var fontsize = this.ctx.font.substring(0, 2);
      var marginTop = (height - fontsize) / 2

      this.ctx.beginPath();
      this.ctx.fillText(this.options.labels.labelsX[index], x + 10, y + marginTop)
      this.ctx.closePath();


    }

    this.drawVerticalGridLine = function() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.minX, this.minY - (this.options.margin / 2));
        this.ctx.lineTo(this.minX, this.maxY);
        this.ctx.strokeStyle = "#DDD";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    this.drawBar = function(y, length, height, index) {
          this.ctx.beginPath();
          console.log({x: this.minX, y:y, l:length, h:height, m:this.options.margin});
          this.ctx.fillStyle = this.options.barColors[index];
          this.ctx.fillRect(this.minX, y, length, height - this.options.margin);
          this.ctx.stroke();
          this.ctx.closePath();
    };

    this.drawBars = function() {

      var segmentHeight = (this.height - this.options.margin) / this.data.length;

      this.currentY = this.minY + (this.options.margin / 2);


      for (var i = 0; i < this.data.length; i++) {
        var proc = this.data[i] / this.maxData;
        var barLength = this.width * proc;
        this.drawBar(this.currentY, barLength, segmentHeight, i);
        this.drawGridLine(this.currentY - (this.options.margin / 2));
        this.drawLabel(this.minX + barLength, this.currentY, segmentHeight, i);
        this.currentY += segmentHeight;
      }

      this.drawGridLine(this.currentY - (this.options.margin / 2));
      this.drawVerticalGridLine();
    };

    this.drawTitle = function() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#777";
        this.ctx.font = "12px " + this.options.font.family;
        this.ctx.fillText(this.options.title, (this.c.width / 2) - this.options.title.length * 2.5, this.minY / 3);
        this.ctx.closePath();
    };

    this.draw = function() {
        // this.drawBar(90, 100, 40);
        this.drawBars();
        this.drawTitle();
    };
}
