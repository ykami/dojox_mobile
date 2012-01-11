dojo.addOnLoad(function(){
	var CLASSNAMES = ["mblTabBarButton", "mblTabBarButtonHasIcon", "mblTabBarButtonSelected"];
	doh.register("dojox.mobile.test.doh.TabBar", [
		{
			name: "TabBar and TabBarButton Verification",
			timeout: 4000,
			runTest: function(){
				var d = new doh.Deferred();
				setTimeout(d.getTestCallback(function(){
					var demoWidget = dijit.byId("dojox_mobile_TabBar_0");
					doh.assertEqual('mblTabBar mblTabBarSegmentedControl', demoWidget.domNode.className);

					verifyTabBarButton("dojox_mobile_TabBarButton_0", 'New', CLASSNAMES, 'hidden', '', /tab-icon-16.png/i, /tab-icon-16h.png/);

					demoWidget = dijit.byId("dojox_mobile_TabBar_1");
					doh.assertEqual('mblTabBar mblTabBarTabBar', demoWidget.domNode.className);

					verifyTabBarButton("dojox_mobile_TabBarButton_3", 'New', CLASSNAMES, 'hidden', '', /tab-icon-16.png/i, /tab-icon-16h.png/);

					demoWidget = dijit.byId("dojox_mobile_TabBar_2");
					doh.assertEqual('mblTabBar mblTabBarTabBar', demoWidget.domNode.className);

					verifyTabBarButton("dojox_mobile_TabBarButton_6", 'Featured', CLASSNAMES, 'hidden', '', /tab-icons.png/i, /tab-icons.png/i, true);
					demoWidget = dijit.byId("dojox_mobile_TabBarButton_6");
					verifyRect(demoWidget.iconNode1.childNodes[0], "0px", "29px", "29px", "0px");
					verifyRect(demoWidget.iconNode2.childNodes[0], "29px", "29px", "58px", "0px");
				}),500);
				return d;
			}
		},
		{
			name: "TabBar and TabBarButton set",
			timeout: 4000,
			runTest: function(){
				var d = new doh.Deferred();
				setTimeout(d.getTestCallback(function(){
					var demoWidget = dijit.byId("dojox_mobile_TabBar_0");


					demoWidget = dijit.byId("dojox_mobile_TabBarButton_2");
					demoWidget.set({label:"New Value"});
//					demoWidget.select();
					demoWidget.set({selected:true});

					verifyTabBarButton("dojox_mobile_TabBarButton_2", 'New Value', CLASSNAMES, 'hidden', '', /tab-icon-10.png/i, /tab-icon-10h.png/);
					demoWidget = dijit.byId("dojox_mobile_TabBarButton_5");
					demoWidget.set({label:"New Value", icon1:"../images/tab-icon-11.png", icon2:"../images/tab-icon-11h.png"});
//					demoWidget.select();
					demoWidget.set("selected",true);

					verifyTabBarButton("dojox_mobile_TabBarButton_5", 'New Value', CLASSNAMES, 'hidden', '', /tab-icon-11.png/i, /tab-icon-11h.png/)

					demoWidget = dijit.byId("dojox_mobile_TabBarButton_4");
					demoWidget.set({icon1:null, icon2:null});
					doh.assertEqual(null, demoWidget.iconNode1, demoWidget.domNode.id);
					doh.assertEqual(null, demoWidget.iconNode2, demoWidget.domNode.id);

				}),500);
				return d;
			}
		}
	]);
	doh.run();
});
