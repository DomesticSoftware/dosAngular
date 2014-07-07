angularJSApp.directive('postRender', ['$timeout', function ($timeout) {
    var def = {
        //restrict: 'A',
        //terminal: true,
        //transclude: true,
        link: function (scope, element, attrs) {
            $timeout(scope.postRender, 0);  //Calling a scoped method
        }
    };
    return def;
}])

angularJSApp.directive('SquareMetersInput', function ($parse) {
    return {
        restrict: 'AC',
        replace: false,
        scope: {
        },
        //template: '<input type="text" />',       
        link: function ($scope, $ellement, $attr) {
            //var obj = $($ellement).find('input');

            if ($($ellement).is("input[type=text]")) {
                $($ellement).autoNumeric('init', { aSep: '.', aDec: ',', aSign: '', mDec: 2 });

                $($ellement).addClass($attr.inputClass);

                $scope.$parent.$watch($attr.ngModel, function (value) {
                    //console.log(value); //, Error().stack);
                    if (value != null) $($ellement).autoNumeric('set', value);
                });

                $($ellement).focusout(function (e) {
                    $scope.$apply(function () {

                        if ($attr.ngModel != null) $parse($attr.ngModel).assign($scope.$parent, $(e.currentTarget).autoNumeric('get'));
                        if ($attr.ngModelnet != null) $parse($attr.ngModelnet).assign($scope.$parent, $(e.currentTarget).autoNumeric('get').replace('.', ','));
                    });
                });
            }
        }
    }
});

angularJSApp.directive('CurrencyInput', function ($parse) {
    return {
        restrict: 'AC',
        replace: false,
        scope: {
        },
        //template: '<input type="text" />',
        link: function ($scope, $ellement, $attr) {
            //var obj = $($ellement).find('input');

            //$($ellement).autoNumeric('init', { aSep: '.', aDec: ',', aSign: '€ ', mDec: 2 });

            if ($($ellement).is("input[type=text]")) {

                $($ellement).autoNumeric('init', { aSep: '.', aDec: ',', aSign: '€ ', mDec: 2 });
                $($ellement).addClass($attr.inputClass);


                $scope.$parent.$watch($attr.ngModel, function (value) {
                    //console.log(value); //, Error().stack);
                    if (value != null) $($ellement).autoNumeric('set', value);
                });

                $($ellement).focusout(function (e) {
                    $scope.$apply(function () {

                        if ($attr.ngModel != null) $parse($attr.ngModel).assign($scope.$parent, $(e.currentTarget).autoNumeric('get'));
                        if ($attr.ngModelnet != null) $parse($attr.ngModelnet).assign($scope.$parent, $(e.currentTarget).autoNumeric('get').replace('.', ','));
                    });
                });
            }
        }
    }
});

angularJSApp.directive('Select2', function ($parse) {
    return {
        restrict: 'AC',
        //replace: true,
        //transclude: true,
        scope: {
            title: '@',
            callback: '&'
        },
        //template: '<div class="control-group" >' +
        //                    '<label class="control-label">{{title}}</label>' +
        //                    '<div class="controls">' +
        //                        '<input type="hidden" class="span testetstesttetstetste" />' +
        //                    '</div>' +
        //                '</div>',
        link: function ($scope, $ellement, $attr) {
            $scope.Page = null;
            $scope.TotalPages = null;

            var selectedValue;
            var obj = $($ellement); //.find('input');
            $scope.Select2 = obj;
            if (typeof $attr.name != 'undefined') {
                $scope.$parent[$attr.name] = $scope.Select2;
            }

            if ($($ellement).is("select")) {
                selectedValue = $($ellement).val();
                $($ellement).select2();
            }

            if ($($ellement).is("input[type=hidden]")) {
                var postify = { term: null };

                var data = $attr.data != null ? $.isPlainObject($attr.data) ? $attr.data : $.parseJSON($attr.data) : null;

                if (data != null) {
                    $.extend(postify, data);
                }

                if ($attr.dataurl != null) {
                    $.get($attr.dataurl, $.postify(postify), function (response) {
                        obj.select2({
                            placeholder: $attr.placeholder, //'Type to search for Product Services...',
                            minimumInputLength: $attr.minimuminputlength,
                            allowClear: $attr.allowclear,
                            multiple: $attr.multiple,
                            data: { results: response.results != null ? response.results : response },
                            createSearchChoice: function (term, data) {
                                if ($attr.createSearchChoice == true && ($(data).filter(function () { return this.text.localeCompare(term) === 0; }).length === 0)) {
                                    return { id: term, text: term };
                                }
                            }
                        });
                    });
                };

                if ($attr.paged == 'true' || $attr.paged == true) {
                    $scope.Page = 0;
                }

                if ($attr.queryurl != null)
                    obj.select2({
                        placeholder: $attr.placeholder, //'Type to search for Product Services...',
                        minimumInputLength: $attr.minimuminputlength,
                        allowClear: $attr.allowclear,
                        multiple: $attr.multiple,
                        createSearchChoice: function (term, data) {
                            if ($attr.createSearchChoice == true && ($(data).filter(function () { return this.text.localeCompare(term) === 0; }).length === 0)) {
                                return { id: term, text: term };
                            }
                        },
                        query: function (query) {
                            $.ajax({
                                type: 'GET',
                                url: $attr.queryurl,
                                data: $.postify({ term: query.term, page: query.page }),
                                success: function (response) { query.callback(response); },
                                //cache: false,
                                async: true
                            });
                        },
                        initSelection: function (element, callback) {
                            //element.val() Στο multiple αυτό έχει array απο string π.χ "1528,1387"
                            var Ids = element.val();
                            if ($attr.multiple == 'true' || $attr.multiple == true) {
                                Ids = element.val().split(',');
                            }
                            //console.log(Ids);

                            $.ajax({
                                type: 'GET',
                                url: $attr.queryurl,
                                data: $.postify({ term: null, page: null, Id: Ids }),
                                success: function (response) {
                                    var items = response.results != null ? response.results : response

                                    //console.log(response.results);
                                    //Η σωστή σειρά εμφάνισεις σε Multiple ειναι στο Ids...
                                    if ($attr.multiple == 'true' || $attr.multiple == true) {
                                        data = [];
                                        $.each(Ids, function (index, value) { //"1528,1387"                                            
                                            $.each(items, function (key, result) {
                                                debugger;
                                                if (value == result.id) {
                                                    data.push(result);
                                                }
                                            });
                                        });

                                    }
                                    else {
                                        debugger;
                                        data = items[0];
                                    }
                                    //$.each(items, function (key, value) {
                                    //    if (value.id == element.val())
                                    //        data = value; //{ id: value.Id, text: value.Number };
                                    //});

                                    callback(data);
                                },
                                //cache: false,
                                async: true
                            });
                        }
                    });

                //$scope.Select2 = obj;
            }


            $($scope.Select2).bind('change', function (e) {
                //Λέμε στο Angular να ενεημερώσει τα δεδομένα του, γιατί το change έγινε εκτός Angular...
                $scope.$apply(function () {
                    /* 
                        $scope.$parent.CompaniesCategories = $($scope.Select2).select2('data');
                        Αντί για αυτο το παραπάνω, καλούμε την $parse με παράμετρο ότι εχει μέσα το attribute ngModel (που ειναι η μεταβλητή που κάνει bind ο χρήστης),
                        αυτή μας επιστρέφει μια function assign, στην οποία περνάμε το PARENT SCOPE (γιατί εδώ έχουμε private Scope), και τα δεδομένα που θέλουμε!
                    */

                    if ($attr.multiple == true || $attr.multiple == 'true') {
                        var values = [];

                        $.each($($scope.Select2).select2('data'), function (key, value) {
                            values.push(value.id);
                        });

                        $parse($attr.ngModel).assign($scope.$parent, values); //$($scope.Select2).select2('data'));
                    }
                    else {
                        $parse($attr.ngModel).assign($scope.$parent, $($scope.Select2).select2('data') != null ? $($scope.Select2).select2('data').id : null);
                        if ($attr.ngModelobj != null) {
                            $parse($attr.ngModelobj).assign($scope.$parent, $($scope.Select2).select2('data') != null ? $($scope.Select2).select2('data') : null);
                        }

                    }

                    $scope.callback();
                    //console.log($scope.$parent.CompaniesCategories, $($scope.Select2).select2('data'));
                });
            });

            $scope.$parent.$watch($attr.ngModel, function (value) {
                //console.log('Value of ' + $attr.ngModel + ' : ' + value); //, Error().stack);
                if (obj.is("select")) {
                    if (typeof value != 'undefined' && value != null) {
                        obj.select2('val', value.toString());
                    }
                    else {
                        var element = $parse($attr.ngModel);
                        if (typeof element(content) != 'undefined' && element(content) != null) {
                            $parse($attr.ngModel).assign($scope.$parent, selectedValue);
                        }
                    }
                }
                else {
                    obj.select2('val', null);
                    if (typeof value != 'undefined' && value != null)
                        if ($.isArray(value))
                            obj.select2('val', value);
                        else
                            obj.select2('val', value.toString());
                }

            });
        }
    }
});

angularJSApp.directive('ngCheckBox', function ($parse) {
    return {
        restrict: 'AC',
        scope: {
            LabelInfo: '@labelinfo',
            onClick: '&onclick'
        },
        replace: true,
        template: '<label class="checkbox">' +
                    '<input type="checkbox" /> {{LabelInfo}}' +
                   '</label>',
        link: function ($scope, $ellement, $attr) {
            $scope.CheckBox = $($ellement).find('input');

            $($scope.CheckBox).on('click', function (ev) {
                $scope.$apply(function () {
                    $parse($attr.ngModel).assign($scope.$parent, $($scope.CheckBox).prop('checked'));
                    $scope.onClick();
                });
            });

            $scope.$parent.$watch($attr.ngModel, function (value) {
                $($scope.CheckBox).prop('checked', value);
            });

        }
    }
});

angularJSApp.directive('DatePicker', function ($parse) {
    return {
        restrict: 'C',
        scope: {
            //    //Private Scope
            //    Pager: '=pager',
            //    GetItems: '&ongetitems'
            dateFormat: '@dataformat'
        },
        transclude: false,
        replace: true,
        template: '<div class="input-append date" data-date="" data-date-format="dd/mm/yyyy">' +
                        '<input size="16" type="text"> ' +
                        '<span class="add-on"><i class="icon-th"></i></span>' +
                    '</div>',
        controller: ['$scope', '$http', function ($scope, $http) {
        }],
        link: function ($scope, $ellement, $attr) {

            $($ellement).find('input[type=text]').bind('keyup', function (ev) {
                //console.log('Change Date on text change ' + ev);

                if ($(ev.target).val().trim() == '')
                    $scope.$apply(function () {
                        $scope.SelectedDate = null;
                        $parse($attr.ngModel).assign($scope.$parent, $scope.SelectedDate);
                    });

            });

            $($ellement).datepicker().on('changeDate', function (ev) {
                //var ll = moment($scope.datepicker.datepicker().data('datepicker').date).utc().format();                
                //console.log('Change Date ' + ev);
                $scope.SelectedDate = ev.date;
                $scope.$apply(function () {
                    $parse($attr.ngModel).assign($scope.$parent, moment(ev.date).utc().format());
                });
            });

            $scope.$parent.$watch($attr.ngModel, function (value) {
                if ($scope.SelectedDate == null) {
                    //var date = moment(value).format($attr.format != null ? $attr.format : 'DD/MM/YYYY');
                    //date = moment(value);
                    if (value != null) {
                        $scope.SelectedDate = moment(value)._isUTC ? moment(value) : moment(value).utc();
                        $parse($attr.ngModel).assign($scope.$parent, moment($scope.SelectedDate).utc().format());
                    }
                }

                //console.log('Value of DatePicker Element: ' + value); //, Error().stack);
                //var date = moment(moment(value).format($attr.format != null ? $attr.format : 'DD/MM/YYYY')).utc().format();
                //var date = moment(value).format($attr.format != null ? $attr.format : 'DD/MM/YYYY');
                //date = moment(value).utc();

                if ($scope.SelectedDate != null) $($ellement).datepicker('setValue', $scope.SelectedDate);
                //obj.datepicker('setValue', moment(value).format($attr.format != null ? $attr.format : 'DD/MM/YYYY'));
            });
        }
    }
});

angularJSApp.directive('LoadingDataBar', function ($parse) {
    return {
        restrict: 'AC',
        replace: true,
        scope: {
            LabelInfo: '@labelinfo',
        },
        template: '<div class="progress active-bar-success active progress-striped" style="width: 100%; height: 25px;">' +
                  '<div class="bar" style="width: 100%;">{{LabelInfo == null ? \'Loading Data, Please Wait...\' : LabelInfo}}</div>' +
                  '</div>',
        link: function ($scope, $ellement, $attr) {
        }
    }
});