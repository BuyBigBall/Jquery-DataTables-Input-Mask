var editor; // use a global for the submit and return data rendering in the examples

$(document).ready(function () {

    editor = new $.fn.dataTable.Editor({
        table: "#example",
        idSrc: 'name',
        fields: [{
            label: "Name:",
            name: "name"
        }, {
            label: "East:",
            name: "east",
            attr: {
                placeholder: "000000.00"
            }
        }, {
            label: "Number:",
            name: "tnumber",
            //setFormatter: function (val) {
            //    /*return (Math.round(val * 100) / 100).toFixed(2);*/
            //    return Number(val).toFixed(2);
            //},
            attr: {
                placeholder: "0000.00",
                type: "number",
                step: "1.00",
                autocomplete: "off"
            }
        }
        ]
    });

    editor.field('tnumber').input().on('change', function () {
        var val = parseFloat(this.value);
        //this.value = val.toFixed(2);
        if (val <= 0) {
            this.value = "0.00";
        }
        val_array = this.value.split('.')
        
    });

    editor.on('open', function (e, mode, action) {

        var strHidden = "<input id='hInsteedNum' style='display:none' value='' />";
        this.field('tnumber').input().parent().append(strHidden);


        this.field('tnumber').input().addClass('tnumber');
        //$('.tnumber').mask('0000.00', {
        //    translation: {
        //        '0': {
        //            pattern: /[0-9]/, optional: false
        //        }
        //    }
        //});


        // ###################### ---> validation start
        this.field('east').input().addClass('east');
        $('.east').mask('000000.00', {
            translation: {
                '0': {
                    pattern: /[0-9]/, optional: false
                }
            }
        });

        $(".DTE_Form_Buttons button").mousedown(function (e) {
            return CheckIsavailableBuddon(e);
        });

        var number_cursor_position;
        var east_cursor_position;

        $(".east").bind("blur", function(e) {
            if ($(this).val().length < 9) {
                e.preventDefault();
                $(this).focus();
                return false;
            }
        });

        $(".east").bind("keydown click focus", function () {
            console.log(cursor_changed2(this));
        });


        function cursor_changed2(element) {
            var new_position = getCursorPosition(element);
            if (new_position !== east_cursor_position) {
                east_cursor_position = new_position;
                return true;
            }
            return false;
        }

        function getCursorPosition(element) {
            var el = $(element).get(0);
            var pos = 0;
            if ('selectionStart' in el) {
                pos = el.selectionStart;
            } else if ('selection' in document) {
                el.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -el.value.length);
                pos = Sel.text.length - SelLength;
            }
            return pos;

        }
        var inputCompleteTimer = null;
        this.field('tnumber').input().addClass('tnumber');
        $('.tnumber').keyup(function (e) {

            console.log(number_cursor_position);

            var cellText = $(this).val();
            val_array = cellText.split('.')
            if (val_array.length >= 2 && val_array[1].length >= 2) {
                var val = parseFloat(this.value);
                this.value = val_array[0] + '.' + val_array[1].substr(0, 2);
            }



            if (isNaN(cellText)) cellText = "0.00";


            if ($(this).val().length == 0) number_cursor_position = 0;
            if (e.keyCode == 190 || e.keyCode == 110) {
                $("#hInsteedNum").val(cellText + '.');
            }
            else {
                $("#hInsteedNum").val(cellText);
            }
            keydownflag = false;
            //$('.tnumber').trigger('input propertychange');      //this contain timer handler for '.00'

            if (inputCompleteTimer != null) {
                clearTimeout(inputCompleteTimer);
            }
            inputCompleteTimer = setTimeout(function () {
                        var cellText = $('.tnumber').val();
                        var val_array = cellText.split('.')
                        if (val_array.length == 1 && val_array[0].length > 0) {
                            if (point_details != '')
                                $('.tnumber').val(val_array[0] + '.' + point_details)
                            else
                                $('.tnumber').val(val_array[0] + '.00')
                        }
                        else if (val_array.length == 0 || val_array.length == 1 && val_array[0].length == 0) {
                            $('.tnumber').val('0.00')
                        } else {
                            if (val_array[1].length == 1)
                                $('.tnumber').val(cellText + '0')
                            else if (val_array[1].length == 0)
                                $('.tnumber').val(cellText + '00')
                        }

                        number_cursor_position = $('.tnumber').val().length;

                        return CheckIsavailableBuddon(e);

                    },
                1500);

        })

        var keydownflag = false;
        // timer handler for '.00'
        // spin button click event handler 
        $('.tnumber').on('input propertychange', function (e) {
            var cellText = $(this).val();
            if (!keydownflag) {
                number_cursor_position = cellText.length;
            }
            if (inputCompleteTimer != null) {
                clearTimeout(inputCompleteTimer);
            }
            if (!keydownflag) {
                inputCompleteTimer = setTimeout(function () {
                    var cellText = $('.tnumber').val();
                    var val_array = cellText.split('.')
                    if (val_array.length == 1 && val_array[0].length > 0) {
                        if (point_details != '')
                            $('.tnumber').val(val_array[0] + '.' + point_details)
                        else
                            $('.tnumber').val(val_array[0] + '.00')
                    }
                    else if (val_array.length == 0 || val_array.length == 1 && val_array[0].length == 0) {
                        $('.tnumber').val('0.00')
                    } else {
                        if (val_array[1].length == 1)
                            $('.tnumber').val(cellText + '0')
                        else if (val_array[1].length == 0)
                            $('.tnumber').val(cellText + '00')
                    }

                    number_cursor_position = $('.tnumber').val().length;

                    return CheckIsavailableBuddon(e);
                },
                    1500);
            }
            });
            

        $('.tnumber').mousedown(function (e) {
            //console.log(e.offsetX);
            if (e.offsetX <= 15) number_cursor_position = 0;
            else if (e.offsetX <= 27) {
                number_cursor_position = 1;
                if (number_cursor_position > $('.tnumber').val().length) number_cursor_position = $('.tnumber').val().length;
            }
            else if (e.offsetX <= 35) {
                number_cursor_position = 2;
                if (number_cursor_position > $('.tnumber').val().length) number_cursor_position = $('.tnumber').val().length;
            }
            else if (e.offsetX <= 43) {
                number_cursor_position = 3;
                if (number_cursor_position > $('.tnumber').val().length) number_cursor_position = $('.tnumber').val().length;
            }
            else if (e.offsetX <= 50) {
                number_cursor_position = 4;
                if (number_cursor_position > $('.tnumber').val().length) number_cursor_position = $('.tnumber').val().length;
            }
            else if (e.offsetX <= 55) {
                number_cursor_position = 5;
                if (number_cursor_position > $('.tnumber').val().length) number_cursor_position = $('.tnumber').val().length;
            }
            else if (e.offsetX <= 63) {
                number_cursor_position = 6;
                if (number_cursor_position > $('.tnumber').val().length) number_cursor_position = $('.tnumber').val().length;
            }
            else if (e.offsetX <= 1000) {
                number_cursor_position = 7;
                if (number_cursor_position > $('.tnumber').val().length) number_cursor_position = $('.tnumber').val().length;
            }
        });



        var point_details = '';
        $('.tnumber').keydown(function (e) {
            keydownflag = true;
            const digitlength = 4;
            
            // input Numpade digit or digit or point .
            if ( (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode == 110 || e.keyCode == 190)) {

                var val_array = $(this).val().split('.')

                point_details = '';

                // second point
                if (val_array.length >= 2) {
                    if (e.keyCode == 190 || e.keyCode == 110) {
                        e.preventDefault();
                        return;
                    }
                }

                //at point next position
                //if ($("#hInsteedNum").val().length > $(this).val().length) {            
                //    number_cursor_position = $("#hInsteedNum").val().length;
                //}

                // at point position
                if (e.keyCode == 190 || e.keyCode == 110) {
                    //$(this).val($(this).val() + '.');   // this will be string to empty.
                    number_cursor_position = $(this).val().length+1;
                    //e.preventDefault();
                    return true;
                };

                
                // digit input before point
                if (val_array.length == 1) {
                    //if (number_cursor_position < val_array[0].length &&      // before point
                    //    val_array[0].length >= digitlength) {
                    //        e.preventDefault();
                    //}

                    if (    number_cursor_position <= val_array[0].length  &&   // before point
                            val_array[0].length >= digitlength) {               // 4 digit
                        if ( !(e.keyCode == 190 || e.keyCode == 110))            // number input
                        {
                            var charNumber = 0;
                            if (e.keyCode < 90) charNumber = e.keyCode - 48;
                            else charNumber = e.keyCode - 96;

                            var rest = val_array[0].substr(1, digitlength - 1);
                            $(this).val(rest + charNumber);
                            number_cursor_position = digitlength;
                            e.preventDefault();
                            return true;
                            
                            //e.preventDefault();
                        }
                    }
                }

                if (val_array.length == 2) {

                    // 2 digit input after point
                    if (number_cursor_position >= val_array[0].length + 1 && val_array[1].length >= 2) {
                        var rest = val_array[0] + '.' + val_array[1].substr(1);
                        var charNumber = 0;
                        if (e.keyCode < 90) charNumber = e.keyCode - 48;
                        else charNumber = e.keyCode - 96;

                        $(this).val(rest + charNumber);
                        number_cursor_position = $(this).val().length;
                        //$(this).selectionStart = val_array[0].length + 2;
                        e.preventDefault();
                        return true;
                    }
                    
                    //else if (number_cursor_position >= val_array[0].length + 1 && val_array[1].length >= 2) {
                    //    e.preventDefault();
                    //}

                    // 4 digit input before point
                    if (number_cursor_position <= val_array[0].length && val_array[0].length >= digitlength) {
                    //    e.preventDefault();
                    //}
                    //if (number_cursor_position == val_array[0].length  && val_array[0].length >= digitlength) {
                        if (!(e.keyCode == 190 || e.keyCode == 110))            // number input
                        {
                            var charNumber = 0;
                            if (e.keyCode < 90) charNumber = e.keyCode - 48;
                            else charNumber = e.keyCode - 96;

                            var rest = val_array[0].substr(1, digitlength - 1);
                            $(this).val(rest + charNumber +  '.' + val_array[1] );
                            point_details = val_array[1];
                            number_cursor_position = digitlength;
                            e.preventDefault();
                            return true;
                            //e.preventDefault();
                        }
                    }
                }

            }
            else {
                if (e.keyCode == 37 || e.keyCode == 8) {
                    number_cursor_position--; if (number_cursor_position < 0) number_cursor_position = 0;
                }
                if (e.keyCode == 39) {
                    number_cursor_position++; if (number_cursor_position > $('.tnumber').val().length) number_cursor_position = $('.tnumber').val().length;
                }
                if (e.keyCode == 36) number_cursor_position = 0;
                if (e.keyCode == 35) number_cursor_position = $('.tnumber').val().length;

                if (e.keyCode != 37 &&  //left
                    e.keyCode != 39 &&  //right
                    e.keyCode != 38 &&  //up
                    e.keyCode != 40 &&  //down
                    e.keyCode != 8 &&   //bs
                    e.keyCode != 16 &&  //shift
                    e.keyCode != 35 &&  //home
                    e.keyCode != 36 &&  //end
                    e.keyCode != 46 &&  //del
                    e.keyCode != 27 &&  //esc
                    e.keyCode != 13     //enter
                ) {
                    e.preventDefault();
                    return;
                }
                if (e.keyCode == 13) {
                    $(this).trigger('blur', e);
                }
                if (e.keyCode == 27) {
                    $(this).val(original);
                    cancel = true;
                    $(this).trigger('blur', e);
                }
            }
        });

        var eastChangeTimer = null;

        this.field('east').input().addClass('east');
        $('.east').keyup(function (e) {
            if (eastChangeTimer != null) {
                clearTimeout(eastChangeTimer);
            }

            CheckIsavailableBuddon(e);

            var cellText = $(this).val();
            eastChangeTimer = setTimeout(function () {
                        val_array = cellText.split('.')
                        if (val_array[0].length >= 6) {

                            if (val_array.length == 1 && val_array[0].length > 0) {
                                $('.east').val(val_array[0] + '.00')
                            }
                            else if (val_array.length == 0 || val_array.length == 1 && val_array[0].length == 0) {
                                $('.east').val('0.00')
                            } else {
                                if (val_array[1].length == 1)
                                    $('.east').val(cellText + '0')
                                else if (val_array[1].length == 0)
                                    $('.east').val(cellText + '00')
                            }
                        }

                        return CheckIsavailableBuddon(e);
                    },
                1500);
        })
        $('.east').keydown(function (e) {
            const digitlength = 6;

            if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 190 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode == 110) {
                val_array = $(this).val().split('.')
                if (val_array.length >= 2) {
                    if (e.keyCode == 190 || e.keyCode == 110) {
                        e.preventDefault();
                        return;
                    }
                }
                
                // digit input before point
                if (val_array.length == 1) {
                    if (east_cursor_position != val_array[0].length &&      // before point
                        val_array[0].length >= digitlength) {
                        e.preventDefault();
                    }
                    if (east_cursor_position == val_array[0].length  && // before point
                        val_array[0].length >= digitlength) {               // 4 digit
                        if (!(e.keyCode == 190 || e.keyCode == 110))        // number input
                        {
                            var rest = val_array[0].substr(1, val_array[0].length - 1);
                            $(this).val(rest);
                            if (this.setSelectionRange !== undefined) {
                                this.setSelectionRange(val_array[0].length - 1, val_array[0].length - 1);
                            } else {
                                $(this).val(this.value);
                            }
                            return true;
                            //e.preventDefault();
                        }
                    }
                }

                if (val_array.length == 2) {

                    if (east_cursor_position >= val_array[0].length + 1 && val_array[1].length>=2) {
                        var rest = val_array[0] + '.' + val_array[1].substr(1);
                        $(this).val(rest);
                        $(this).selectionStart = val_array[0].length + 2;
                        return true;
                    }
                    //else if (east_cursor_position >= val_array[0].length + 1 && val_array[1].length >= 2) {
                    //    e.preventDefault();
                    //}

                    if (east_cursor_position <= val_array[0].length && val_array[0].length >= digitlength) {
                    //    e.preventDefault();
                    //}
                    //if (east_cursor_position == val_array[0].length && val_array[0].length >= digitlength) {
                        if (!(e.keyCode == 190 || e.keyCode == 110))        // number input
                        {
                            var rest = val_array[0].substr(1, val_array[0].length - 1);
                            $(this).val(rest + '.' + val_array[1]);

                            if (this.setSelectionRange !== undefined) {
                                this.setSelectionRange(val_array[0].length - 1, val_array[0].length-1);
                            } else {
                                $(this).val(this.value);
                            }
                            return true;
                            //e.preventDefault();
                        }
                    }
                }

            }
            else {
                if (e.keyCode != 37 &&  //left
                    e.keyCode != 39 &&  //right
                    e.keyCode != 8 &&   //bs
                    e.keyCode != 16 &&  //shift
                    e.keyCode != 35 &&  //home
                    e.keyCode != 36 &&  //end
                    e.keyCode != 46 &&  //del
                    e.keyCode != 27 &&  //esc
                    e.keyCode != 13     //del
                ) {
                    e.preventDefault();
                    return;
                }
                if (e.keyCode == 13) {
                    $(this).trigger('blur', e);
                }
                if (e.keyCode == 27) {
                    $(this).val(original);
                    cancel = true;
                    $(this).trigger('blur', e);
                }

            }

           
        });
        //<---########################


    });

    var table = $('#example').DataTable({
        lengthChange: false,
        columns: [
            { data: "name" },
            {
                data: "east",
                render: $.fn.dataTable.render.number('', '.', 2),
                className: "dt-center"
            },
            {
                data: "tnumber",
                render: $.fn.dataTable.render.number('', '.', 2),
                className: "dt-center"
            },
        ],
        select: true,
        language: {
            decimal: ".",
            thousands: ""
        },

    });

    // Display the buttons
    new $.fn.dataTable.Buttons(table, [
        { extend: "create", editor: editor },
        { extend: "remove", editor: editor },
        { extend: "edit", editor: editor }
    ]);

    table.buttons().container()
        .appendTo($('.col-md-6:eq(0)', table.table().container()));

    function CheckIsavailableBuddon(e) {
        if ($(".east").val().length < 9 || $(".tnumber").val().length < 4) {    // tnumber value minimum (0.00)
            e.preventDefault();
            if ($(".east").val().length < 9) $('.east').focus();
            if ($(".tnumber").val().length < 4) $(".tnumber").focus();
            $(".DTE_Form_Buttons button").addClass("disabled");
            $(".DTE_Form_Buttons button").prop("disabled", true);
            return false;
        }
        else {
            $(".DTE_Form_Buttons button").removeClass("disabled");
            $(".DTE_Form_Buttons button").prop("disabled", false);
            return true;
        }

    }
});

