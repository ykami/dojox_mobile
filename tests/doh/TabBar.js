dojo.addOnLoad(function(){
	doh.register("dojox.mobile.test.doh.TabBar", [
		{
			name: "TabBar and TabBarButton Verification",
			timeout: 4000,
			runTest: function(){
				var d = new doh.Deferred();
				setTimeout(d.getTestCallback(function(){
					var demoWidget = dijit.byId("dojox_mobile_TabBar_0");
					doh.assertEqual('mblTabBar mblTabBarSegmentedControl', demoWidget.domNode.className);

					verifyTabBarButton("dojox_mobile_TabBarButton_0", 'New', "mblTabBarButton mblTabBarButtonSelected", 'hidden', '', /tab-icon-16.png/i, /tab-icon-16h.png/);

					demoWidget = dijit.byId("dojox_mobile_TabBar_1");
					doh.assertEqual('mblTabBar mblTabBarTabBar', demoWidget.domNode.className);

					verifyTabBarButton("dojox_mobile_TabBarButton_3", 'New', "mblTabBarButton mblTabBarButtonSelected", 'hidden', '', /tab-icon-16.png/i, /tab-icon-16h.png/);

					demoWidget = dijit.byId("dojox_mobile_TabBar_2");
					doh.assertEqual('mblTabBar mblTabBarTabBar', demoWidget.domNode.className);

					verifyTabBarButton("dojox_mobile_TabBarButton_6", 'Featured', "mblTabBarButton mblTabBarButtonSelected", 'hidden', '', /tab-icons.png/i, /tab-icons.png/i, true);
					demoWidget = dijit.byId("dojox_mobile_TabBarButton_6");
					verifyRect(demoWidget.iconNode1.childNodes[0], "0px", "29px", "29px", "0px");
					verifyRect(demoWidget.iconNode2.childNodes[0], "29px", "29px", "58px", "0px");
				}),500);
				return d;
			}
		}
	]);
	doh.run();
});