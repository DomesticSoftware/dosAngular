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
                
                
                $($ellement).autoNumeric('init', { aSep: '.', aDec: ',', aSign: '€ ', mDec: $attr.mdec == null ? 2 : $attr.mdec });
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
                

                obj.select2({
                    placeholder: $attr.placeholder, //'Type to search for Product Services...',
                    minimumInputLength: $attr.minimuminputlength,
                    allowClear: $attr.allowclear,
                    multiple: $attr.multiple,
                    data: { results: [] },
                    createSearchChoice: function (term, data) {
                        if ($attr.createSearchChoice == true && ($(data).filter(function () { return this.text.localeCompare(term) === 0; }).length === 0)) {
                            return { id: term, text: term };
                        }
                    }
                });
                
                var postify = { term: null };

                var data = $attr.data != null ? $.isPlainObject($attr.data) ? $attr.data : $.parseJSON($attr.data) : null;

                if (data != null) {
                    $.extend(postify, data);
                }
                
                if ($attr.dataurl != null) {
                    
                    $.get($attr.dataurl, postify, function (response) {
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

                        if ($attr.ngModel != null) $parse($attr.ngModel).assign($scope.$parent, values); //$($scope.Select2).select2('data'));
                    }
                    else {
                        if ($attr.ngModel != null) {
                            $parse($attr.ngModel).assign($scope.$parent, $($scope.Select2).select2('data') != null ? $($scope.Select2).select2('data').id : null);
                        }
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
        //template: '<div class="input-append date" data-date="" data-date-format="dd/mm/yyyy">' +
        //                '<input size="16" type="text"> ' +
        //                '<span class="add-on"><i class="icon-th"></i></span>' +
        //            '</div>',
        template: '<div class="input-group date">' +
                    '<input type="text" class="form-control" />' +
                    '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span>' + 
                    '</span>' +
                '</div>',
        controller: ['$scope', '$http', function ($scope, $http) {
        }],
        link: function ($scope, $ellement, $attr) {
            //http://eonasdan.github.io/bootstrap-datetimepicker/#events

            
            $($ellement).datetimepicker({
                language: 'el',
                defaultDate: moment(new Date($attr.date)).format(),
                pickTime: $attr.picktime
            });

            $scope.$parent.$watch($attr.ngModel, function (value) {

                
                if (new Date($($ellement).data("DateTimePicker").getDate()).toString() != new Date(value).toString()) {
                    $scope.SelectedDate = value;
                    $($ellement).data("DateTimePicker").setDate(moment(value).format());
                }
               
            });

            $($ellement).on('dp.change', function (ev) {
                if (new Date(ev.date).toString() == new Date($scope.SelectedDate).toString())
                    return;
                
                $scope.$apply(function () {
                    $parse($attr.ngModel).assign($scope.$parent, moment(ev.date).format());
                });
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

angularJSApp.directive('dsTable', function ($parse) {
    return {
        restrict: 'AC',
        replace: false,
        scope: {
            //LabelInfo: '@labelinfo',
        },
        link: function ($scope, $ellement, $attr) {
            
            if ($attr.geturl != null)
            {   
                $.ajax({
                    type: 'POST',
                    url: $attr.geturl,
                    data: JSON.stringify({ term: null, pager: { ClientPaging: true } } ),
                    contentType: "application/json",
                    success: function (response) {                        
                        $scope.orginalData = response.AllData;                        
                        debugger;
                        //$scope.$apply(function () {
                            if ($attr.ngModel != null) $parse($attr.ngModel).assign($scope.$parent, response);
                        //});
                    },
                    //cache: false,
                    async: true
                });
            }
            if ($attr.queryurl != null)
            {
                $.ajax({
                    type: 'POST',
                    url: $attr.queryurl,
                    data: JSON.stringify({ term: null, pager: {} }),
                    contentType: "application/json",
                    success: function (response) {                        
                        $scope.$apply(function () {                            
                            if ($attr.ngModel != null) $parse($attr.ngModel).assign($scope.$parent, response);                            
                        });
                    },
                    //cache: false,
                    async: true
                });
            }
        }
    }
});

angularJSApp.directive('dsPagination', function ($parse) {
    

    return {
        restrict: 'AC',
        require: 'ngModel',
        scope: {            
        },
        link: function ($scope, $ellement, $attr, $controller, $ngModel) {

            //debugger;

            //var ngModelGet = $parse($attr.ngModel);
            //var ngModel = ngModelGet($scope.$parent);
            //$scope.orginalData = ngModel.data;

            debugger;
            var ngModelGet = $parse($attr.ngModel);
            var ngModel = ngModelGet($scope.$parent);
            var pager = ngModel.Pager; //.Pages[$index];
            $scope.pager = pager;

            $scope.$parent.pageSelected = function ($index, $event, ignoreModel) {
                if ($event != null)
                    $event.preventDefault();

                debugger;
                //$scope.pager = pager;
                pager.PageSize = parseInt(pager.PageSize);

                if ($scope.orginalData == null) $scope.orginalData = ngModel.AllData;

                pager.PageNo = pager.Pages[$index];

                if (pager.ClientPaging == false) {
                    $.ajax({
                        type: 'POST',
                        url: $attr.queryurl,
                        data: JSON.stringify({ term: null, pager: pager }),
                        contentType: "application/json",
                        success: function (response) {
                            $scope.$apply(function () {
                                if ($attr.ngModel != null) {                                    
                                    $parse($attr.ngModel).assign($scope.$parent, response);
                                }
                            });
                        },
                        //cache: false,
                        //async: true
                    });
                }
                else { //Client Paging
                    //Int32 PagesGroups = (Int32)Math.Ceiling(Pages.Count / (decimal)VisiblePages);
                    //Int32 CurrentPageGroup = (Int32)((PageNo - 1) / (decimal)VisiblePages);
                    var tmpPageNo = pager.PageNo;
                    switch (pager.PageNo)
                    {
                        case -10: //Είναι η Αρχική Σελίδα
                            pager.FirstVisiblePage = 1;
                            tmpPageNo = 1;
                            break;
                        case -11: //Είναι η προηγούμενη σελίδα
                            if (pager.FirstVisiblePage > 1)
                            {
                                pager.FirstVisiblePage--;
                                tmpPageNo = pager.FirstVisiblePage;
                                //LastVisiblePage = (FirstVisiblePage - 1) + VisiblePages;
                            }
                            break;
                        case -12: //Είναι η προηγούμενη ομάδα σελίδων
                            // 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
                            //  [7 8 9 10 11]

                            if (pager.FirstVisiblePage - pager.VisiblePages > 0)
                            {
                                pager.FirstVisiblePage -= pager.VisiblePages;
                            }
                            else
                                pager.FirstVisiblePage = 1;

                            tmpPageNo = pager.FirstVisiblePage;
                            //LastVisiblePage = (FirstVisiblePage - 1) + VisiblePages;
                            break;
                
                    }
            
                    //FirstVisiblePage = (CurrentPageGroup * VisiblePages) + 1;
                    pager.LastVisiblePage = (pager.FirstVisiblePage - 1) + pager.VisiblePages;
                    if (pager.PageNo > 0)
                    {
                        if (pager.PageNo == pager.LastVisiblePage && pager.LastVisiblePage < pager.PagesCount)
                        {
                            pager.FirstVisiblePage++;
                            pager.LastVisiblePage = (pager.FirstVisiblePage - 1) + pager.VisiblePages;
                        }

                        if (pager.FirstVisiblePage > 1 && pager.PageNo == pager.FirstVisiblePage)
                        {
                            pager.FirstVisiblePage--;
                            pager.LastVisiblePage = (pager.FirstVisiblePage - 1) + pager.VisiblePages;
                        }
                    }

                    switch (pager.PageNo)
                    {
                        case -20: //Είναι η Τελευταία Σελίδα
                            pager.LastVisiblePage = pager.PagesCount;
                            pager.FirstVisiblePage = pager.LastVisiblePage - pager.VisiblePages;
                            if (pager.FirstVisiblePage < 1) pager.FirstVisiblePage = 1;
                            tmpPageNo = pager.LastVisiblePage;
                            break;
                        case -21: //Είναι η επόμενη σελίδα
                            pager.FirstVisiblePage++;
                            pager.LastVisiblePage = (pager.FirstVisiblePage - 1) + pager.VisiblePages;
                            tmpPageNo = pager.LastVisiblePage;
                            break;
                        case -22: //Είναι η επόμενη ομάδα σελίδων
                            // 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
                            //  [15 16 17 18 19]

                            if (pager.LastVisiblePage + pager.VisiblePages < pager.PagesCount)
                            {
                                pager.LastVisiblePage += pager.VisiblePages;
                            }
                            else
                                pager.LastVisiblePage = pager.PagesCount;

                            pager.FirstVisiblePage = (pager.LastVisiblePage - pager.VisiblePages) + 1;
                            if (pager.FirstVisiblePage < 1) pager.FirstVisiblePage = 1;

                            tmpPageNo = pager.LastVisiblePage;
                            break;
                    }

                    if (pager.PageNo < 0)
                        pager.PageNo = tmpPageNo;

                    if (pager.LastVisiblePage > pager.PagesCount) pager.LastVisiblePage = pager.PagesCount;

                    //$parse($attr.ngModel).assign($scope.$parent, response);
                    //$scope.orginalData

                    pager.Pages = [];
                    pager.Pages.push(-10);
                    pager.Pages.push(-12);

                    for (var i = pager.FirstVisiblePage - 1; i < pager.LastVisiblePage; i++)
                    {
                        pager.Pages.push(i + 1);
                    }

                    pager.Pages.push(-22);
                    pager.Pages.push(-20);
                    
                    
                    ngModel.Data = $scope.orginalData.slice((pager.PageNo - 1) * pager.PageSize, ((pager.PageNo - 1) * pager.PageSize) + pager.PageSize);
                    

                    if (!ignoreModel || ignoreModel == 'unefined')
                        $parse($attr.ngModel).assign($scope.$parent, ngModel);
                }
            }
            
            //$scope.$watch(function () {
            //    debugger;
            //    return $attr.ngModel.$modelValue;

            //}, function (newValue) {
            //    debugger;
            //    console.log(newValue);
            //});

            $scope.$parent.$watch('$tableInfo.Pager.PageSize', function (value) {
                debugger;
                //alert(value);
                //debugger;
                $scope.pager.PagesCount = Math.ceil($scope.pager.RowsCount / $scope.pager.PageSize);
                $scope.$parent.pageSelected($scope.pager.PageNo, null);
                //    //$parse($attr.ngModel).assign($scope.$parent, ngModel);
            });

            
            //debugger;
            //debugger;
            //$scope.$parent.pageSelected(0, null);
            //if ($scope.pager != 'undefined')
            //    if ($scope.pager.ClientPaging == true) {
            //        debugger;
            //        $scope.$parent.pageSelected(0, null);
            //    }

            //debugger;
        }
    }
});