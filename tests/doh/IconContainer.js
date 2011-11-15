dojo.addOnLoad(function(){
	doh.register("dojox.mobile.test.doh.IconContainer", [
		{
			name: "IconContainer Verification",
			timeout: 4000,
			runTest: function(){
				var d = new doh.Deferred();
				setTimeout(d.getTestCallback(function(){
					var demoWidget = dijit.byId("dojox_mobile_IconContainer_0");
					doh.assertEqual('mblIconContainer', demoWidget.domNode.className);
					
				}));
				return d;
			}
		},
		{
			name: "IconItem Verification",
			timeout: 4000,
			runTest: function(){
				var d = new doh.Deferred();
				var demoWidget = dijit.byId("dojox_mobile_IconItem_0");
				var e;
				//lazy loading

				doh.assertEqual('none', demoWidget.paneWidget.domNode.style.display);
				fireOnClick(demoWidget.domNode.childNodes[0].childNodes[0].childNodes[0]);

				demoWidget = dijit.byId("dojox_mobile_IconItem_1");
				doh.assertEqual('none', demoWidget.paneWidget.domNode.style.display);
				fireOnClick(demoWidget.domNode.childNodes[0].childNodes[0].childNodes[0]);

				setTimeout(d.getTestCallback(function(){
					var demoWidget = dijit.byId("dojox_mobile_IconItem_0");
					if(!dojo.isIE) {
						doh.assertTrue(demoWidget.domNode.childNodes[0].childNodes[0].childNodes[0].src.search(/icon3.png/i) != -1);
					}
					doh.assertEqual('app1', demoWidget.domNode.childNodes[0].childNodes[1].childNodes[0].nodeValue);
					doh.assertEqual('', demoWidget.paneWidget.domNode.style.display);
					doh.assertEqual('mblIconItemPaneHeading', demoWidget.paneWidget.domNode.childNodes[0].className);
					doh.assertEqual('mblDomButtonBlueMinus mblDomButton', demoWidget.paneWidget.domNode.childNodes[0].childNodes[0].childNodes[0].className);
					doh.assertEqual('app1', demoWidget.paneWidget.domNode.childNodes[0].childNodes[1].childNodes[0].nodeValue);

					demoWidget = dijit.byId("dojox_mobile_IconItem_1");
					if(!dojo.isIE) {
						doh.assertTrue(demoWidget.domNode.childNodes[0].childNodes[0].childNodes[0].src.search(/icon3.png/i) != -1);
					}
					doh.assertEqual('app2', demoWidget.domNode.childNodes[0].childNodes[1].childNodes[0].nodeValue);
					doh.assertEqual('', demoWidget.paneWidget.domNode.style.display);
					doh.assertEqual('mblIconItemPaneHeading', demoWidget.paneWidget.domNode.childNodes[0].className);
					doh.assertEqual('mblDomButtonBlueMinus mblDomButton', demoWidget.paneWidget.domNode.childNodes[0].childNodes[0].childNodes[0].className);
					doh.assertEqual('app2', demoWidget.paneWidget.domNode.childNodes[0].childNodes[1].childNodes[0].nodeValue);
					
				}),2000);
				return d;
			}
		},
		{
			name: "IconContainer set",
			timeout: 4000,
			runTest: function(){
				var demoWidget = dijit.byId("dojox_mobile_IconContainer_0");
				demoWidget.set({transition:"slide", pressedIconOpacity:"0.8"});

				doh.assertEqual(0.8, demoWidget.get("pressedIconOpacity"));
				doh.assertEqual("slide", demoWidget.get("transition"));
			}
		},
		{
			name: "IconItem set",
			timeout: 1000,
			runTest: function(){
				var demoWidget = dijit.byId("dojox_mobile_IconItem_1");
				demoWidget.set({icon:"../images/icon1.png"});
				doh.assertEqual("../images/icon1.png", demoWidget.get("icon"));
				doh.assertTrue(demoWidget.domNode.childNodes[0].childNodes[0].childNodes[0].src.search(/icon1.png/i) != -1);
			}
		}
	]);
	doh.run();
});
