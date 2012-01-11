var categories = [
	{ tag: "Accordion", label: "Accordion"},
	{ tag: "Badge", label: "Badge"},
	{ tag: "Button", label: "Button"},
	{ tag: "Carousel", label: "Carousel"},
	{ tag: "ContentPane", label: "ContentPane"},
	{ tag: "FixedSplitter", label: "FixedSplitter"},
	{ tag: "FeedReader", label: "FeedReader"},
	{ tag: "FormControls", label: "FormControls"},
	{ tag: "GridLayout", label: "GridLayout"},
	{ tag: "Heading", label: "Heading"},
	{ tag: "Icon", label: "Icon"},
	{ tag: "IconContainer", label: "IconContainer"},
	{ tag: "IconMenu", label: "IconMenu"},
	{ tag: "List", label: "List"},
	{ tag: "Media", label: "Media"},
	{ tag: "Opener", label: "Opener"},
	{ tag: "ProgressIndicator", label: "ProgressIndicator"},
	{ tag: "RoundRect", label: "RoundRect"},
	{ tag: "ScreenSizeAware", label: "ScreenSizeAware"},
	{ tag: "ScrollablePane", label: "ScrollablePane"},
	{ tag: "ScrollableView", label: "ScrollableView"},
	{ tag: "SimpleDialog", label: "SimpleDialog"},
	{ tag: "SpinWheel", label: "SpinWheel"},
	{ tag: "SwapView", label: "SwapView"},
	{ tag: "Switch", label: "Switch"},
	{ tag: "TabBar", label: "TabBar"},
	{ tag: "bookmarkable", label: "bookmarkable"},
	{ tag: "domButton", label: "domButton"},
	{ tag: "dynamic", label: "dynamic"},
	{ tag: "misc", label: "misc"},
	{ tag: "no-dojo", label: "no-dojo"},
	{ tag: "transition", label: "transition"}
];
var tests = [
	{ url: "test_Accordion-demo.html", tags: "Accordion" },
	{ url: "test_ArrowButton.html", tags: "Button" },
	{ url: "test_Audio-single-source.html", tags: "Media" },
	{ url: "test_Audio.html", tags: "Media" },
	{ url: "test_Badge.html", tags: "Badge" },
	{ url: "test_Button.html", tags: "Button" },
	{ url: "test_Calendar.html", tags: "misc" },
	{ url: "test_Carousel-slideshow.html", tags: "Carousel" },
	{ url: "test_Carousel-widgets.html", tags: "Carousel" },
	{ url: "test_Carousel.html", tags: "Carousel" },
	{ url: "test_CarouselItem.html", tags: "Carousel" },
	{ url: "test_ComboBox.html", tags: "FormControls" },
	{ url: "test_ContentPane.html", tags: "ContentPane" },
	{ url: "test_EdgeToEdge.html", tags: "List" },
	{ url: "test_EdgeToEdgeCategory.html", tags: "List" },
	{ url: "test_EdgeToEdgeDataList.html", tags: "List" },
	{ url: "test_EdgeToEdgeFeedReader-atom.html", tags: "FeedReader" },
	{ url: "test_EdgeToEdgeFeedReader-rss.html", tags: "FeedReader" },
	{ url: "test_EdgeToEdgeList-check.html", tags: "List" },
	{ url: "test_EdgeToEdgeList-editable-sv.html", tags: "List" },
	{ url: "test_EdgeToEdgeList-editable.html", tags: "List" },
	{ url: "test_EdgeToEdgeStoreList-auto-sv.html", tags: "List" },
	{ url: "test_EdgeToEdgeStoreList-auto-v.html", tags: "List" },
	{ url: "test_EdgeToEdgeStoreList-categ.html", tags: "List" },
	{ url: "test_EdgeToEdgeStoreList-more-sv.html", tags: "List" },
	{ url: "test_EdgeToEdgeStoreList-more-v.html", tags: "List" },
	{ url: "test_EdgeToEdgeStoreList.html", tags: "List" },
	{ url: "test_FixedSplitter-H2-prog.html", tags: "FixedSplitter" },
	{ url: "test_FixedSplitter-H2.html", tags: "FixedSplitter" },
	{ url: "test_FixedSplitter-V2H2-ContentPane.html", tags: "FixedSplitter" },
	{ url: "test_FixedSplitter-V2H2-change.html", tags: "FixedSplitter" },
	{ url: "test_FixedSplitter-V2H2.html", tags: "FixedSplitter" },
	{ url: "test_FixedSplitter-V3-var0.html", tags: "FixedSplitter" },
	{ url: "test_FixedSplitter-V3-var1.html", tags: "FixedSplitter" },
	{ url: "test_FixedSplitter-V3-var2.html", tags: "FixedSplitter" },
	{ url: "test_FixedSplitter-V3.html", tags: "FixedSplitter" },
	{ url: "test_FixedSplitter-orientation.html", tags: "FixedSplitter" },
	{ url: "test_FormControls.html", tags: "FormControls" },
	{ url: "test_GridLayout.html", tags: "GridLayout" },
	{ url: "test_Heading.html", tags: "Heading" },
	{ url: "test_Icon.html", tags: "Icon" },
	{ url: "test_IconContainer-badge.html", tags: "IconContainer" },
	{ url: "test_IconContainer-connect.html", tags: "IconContainer" },
	{ url: "test_IconContainer-editable.html", tags: "IconContainer" },
	{ url: "test_IconContainer-highlight.html", tags: "IconContainer" },
	{ url: "test_IconContainer-multi.html", tags: "IconContainer" },
	{ url: "test_IconContainer-prog.html", tags: "IconContainer" },
	{ url: "test_IconContainer-pubsub.html", tags: "IconContainer" },
	{ url: "test_IconContainer-removeConfirmation.html", tags: "IconContainer" },
	{ url: "test_IconContainer-single-below.html", tags: "IconContainer" },
	{ url: "test_IconContainer-single.html", tags: "IconContainer" },
	{ url: "test_IconContainer-sprite.html", tags: "IconContainer" },
	{ url: "test_IconContainer-transition-below.html", tags: "IconContainer" },
	{ url: "test_IconContainer-transition-zoom.html", tags: "IconContainer" },
	{ url: "test_IconContainer.html", tags: "IconContainer" },
	{ url: "test_IconMenu-6up.html", tags: "IconMenu" },
	{ url: "test_IconMenu-programmatic.html", tags: "IconMenu" },
	{ url: "test_IconMenu-standalone.html", tags: "IconMenu" },
	{ url: "test_ListItem-actions.html", tags: "List" },
	{ url: "test_ListItem-button.html", tags: "List" },
	{ url: "test_ListItem-domButtons.html", tags: "List" },
	{ url: "test_ListItem-sprite.html", tags: "List" },
	{ url: "test_ListItem-variable-edge.html", tags: "List" },
	{ url: "test_ListItem-variable-round.html", tags: "List" },
	{ url: "test_Opener-ActionSheet-async.html", tags: "Opener" },
	{ url: "test_Opener-Calendar-async.html", tags: "Opener" },
	{ url: "test_Opener-ColorPalette-async.html", tags: "Opener" },
	{ url: "test_Opener-ColorPicker.html", tags: "Opener" },
	{ url: "test_Opener-DateSpinWheel-async.html", tags: "Opener" },
	{ url: "test_Opener-RoundSelectList-async.html", tags: "Opener" },
	{ url: "test_Opener-SearchList-async.html", tags: "Opener" },
	{ url: "test_Overlay.html", tags: "Opener" },
	{ url: "test_ProgressIndicator-color.html", tags: "ProgressIndicator" },
	{ url: "test_ProgressIndicator-heading.html", tags: "ProgressIndicator" },
	{ url: "test_ProgressIndicator-list.html", tags: "ProgressIndicator" },
	{ url: "test_ProgressIndicator-size.html", tags: "ProgressIndicator" },
	{ url: "test_ProgressIndicator.html", tags: "ProgressIndicator" },
	{ url: "test_RoundRect.html", tags: "RoundRect" },
	{ url: "test_RoundRectCategory.html", tags: "RoundRect" },
	{ url: "test_RoundRectDataList.html", tags: "List" },
	{ url: "test_RoundRectFeedReader-atom.html", tags: "FeedReader" },
	{ url: "test_RoundRectFeedReader-rss.html", tags: "FeedReader" },
	{ url: "test_RoundRectList-check.html", tags: "List" },
	{ url: "test_RoundRectList-editable-sv.html", tags: "List" },
	{ url: "test_RoundRectList-editable.html", tags: "List" },
	{ url: "test_RoundRectList-icons.html", tags: "List" },
	{ url: "test_RoundRectList-inherit.html", tags: "List" },
	{ url: "test_RoundRectList-variableHeight.html", tags: "List" },
	{ url: "test_RoundRectList-vh-icons.html", tags: "List" },
	{ url: "test_RoundRectList.html", tags: "List" },
	{ url: "test_RoundRectStoreList.html", tags: "List" },
	{ url: "test_ScreenSizeAware-demo-prop.html", tags: "ScreenSizeAware" },
	{ url: "test_ScreenSizeAware-demo-tag.html", tags: "ScreenSizeAware" },
	{ url: "test_ScreenSizeAware-icon.html", tags: "ScreenSizeAware" },
	{ url: "test_ScreenSizeAware-prop.html", tags: "ScreenSizeAware" },
	{ url: "test_ScreenSizeAware-tag.html", tags: "ScreenSizeAware" },
	{ url: "test_ScrollableMixin-custom.html", tags: "ScrollableView" },
	{ url: "test_ScrollablePane-demo.html", tags: "ScrollablePane" },
	{ url: "test_ScrollablePane-h.html", tags: "ScrollablePane" },
	{ url: "test_ScrollablePane-mask.html", tags: "ScrollablePane" },
	{ url: "test_ScrollablePane.html", tags: "ScrollablePane" },
	{ url: "test_ScrollableView-demo-long.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-demo.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-h.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-hv-ah-af.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-hv-vh-vf.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-hv.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-short-inp.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-short.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v-ah-af-inp.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v-ah-af.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v-ah-inp.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v-inp.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v-vh-af-inp.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v-vh-af.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v-vh-inp.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v-vh-vf-inp.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v-vh-vf.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v-vh.html", tags: "ScrollableView" },
	{ url: "test_ScrollableView-v.html", tags: "ScrollableView" },
	{ url: "test_SimpleDialog-large.html", tags: "SimpleDialog" },
	{ url: "test_SimpleDialog-load.html", tags: "SimpleDialog" },
	{ url: "test_SimpleDialog.html", tags: "SimpleDialog" },
	{ url: "test_Slider.html", tags: "FormControls" },
	{ url: "test_SpinWheel-1slot.html", tags: "SpinWheel" },
	{ url: "test_SpinWheel-custom.html", tags: "SpinWheel" },
	{ url: "test_SpinWheel-icons.html", tags: "SpinWheel" },
	{ url: "test_SpinWheelDatePicker-sv.html", tags: "SpinWheel" },
	{ url: "test_SpinWheelDatePicker.html", tags: "SpinWheel" },
	{ url: "test_SpinWheelTimePicker.html", tags: "SpinWheel" },
	{ url: "test_SwapView-demo.html", tags: "SwapView" },
	{ url: "test_SwapView-slideshow.html", tags: "SwapView" },
	{ url: "test_SwapView.html", tags: "SwapView" },
	{ url: "test_Switch-setter.html", tags: "Switch" },
	{ url: "test_Switch.html", tags: "Switch" },
	{ url: "test_TabBar-badge.html", tags: "TabBar" },
	{ url: "test_TabBar-seg-grouped-scroll.html", tags: "TabBar" },
	{ url: "test_TabBar-seg-grouped.html", tags: "TabBar" },
	{ url: "test_TabBar-seg.html", tags: "TabBar" },
	{ url: "test_TabBar-slim.html", tags: "TabBar" },
	{ url: "test_TabBar-tabPanel.html", tags: "TabBar" },
	{ url: "test_TabBar.html", tags: "TabBar" },
	{ url: "test_Tooltip.html", tags: "Opener" },
	{ url: "test_Video-single-source.html", tags: "Media" },
	{ url: "test_Video.html", tags: "Media" },

	{ url: "test_a11y.html", tags: "misc" },
	{ url: "test_add-to-home-screen-sample.html", tags: "misc" },
	{ url: "test_ajax-html-sync.html", tags: "misc" },
	{ url: "test_ajax-html.html", tags: "misc" },
	{ url: "test_ajax-json-sync.html", tags: "misc" },
	{ url: "test_ajax-json.html", tags: "misc" },
	{ url: "test_anchor-label.html", tags: "misc" },
	{ url: "test_bk-ScrollableView-demo.html", tags: "bookmarkable" },
	{ url: "test_bk-ajax-html.html", tags: "bookmarkable" },
	{ url: "test_bk-list.html", tags: "bookmarkable" },
	{ url: "test_bk-split-views.html", tags: "bookmarkable" },
	{ url: "test_bk-tablet-settings.html", tags: "bookmarkable" },
	{ url: "test_bk-grouped-views.html", tags: "bookmarkable" },
	{ url: "test_domButtons.html", tags: "domButton" },
	{ url: "test_domButtons16.html", tags: "domButton" },
	{ url: "test_domButtonsBadge.html", tags: "domButton" },
	{ url: "test_dynamic-ScrollableView-ah-af.html", tags: "dynamic" },
	{ url: "test_dynamic-ScrollableView-vh-vf.html", tags: "dynamic" },
	{ url: "test_dynamic-icons.html", tags: "dynamic" },
	{ url: "test_dynamic-items.html", tags: "dynamic" },
	{ url: "test_grouped-scrollable-views.html", tags: "misc" },
	{ url: "test_grouped-views.html", tags: "misc" },
	{ url: "test_hash-parameter.html", tags: "misc" },
	{ url: "test_html-form-controls.html", tags: "misc" },
	{ url: "test_html-inputs.html", tags: "misc" },
	{ url: "test_i18n-sync.html", tags: "misc" },
	{ url: "test_i18n.html", tags: "misc" },
	{ url: "test_migrationAssist.html", tags: "misc" },
	{ url: "test_new_transition-animations-standard.html", tags: "transition" },
	{ url: "test_new_transition-animations.html", tags: "transition" },
	{ url: "test_new_transition-animations2.html", tags: "transition" },
	{ url: "test_orientation-transition.html", tags: "misc" },
	{ url: "test_phone-settings.html", tags: "misc" },
	{ url: "test_scrollable-no-dojo-af.html", tags: "no-dojo" },
	{ url: "test_scrollable-no-dojo-ah-af.html", tags: "no-dojo" },
	{ url: "test_scrollable-no-dojo-ah.html", tags: "no-dojo" },
	{ url: "test_scrollable-no-dojo.html", tags: "no-dojo" },
	{ url: "test_tablet-settings.html", tags: "misc" },
	{ url: "test_theme-switch.html", tags: "misc" },
	{ url: "test_transition-animations-extended1.html", tags: "transition" },
	{ url: "test_transition-animations-extended2.html", tags: "transition" },
	{ url: "test_transition-animations-extended3.html", tags: "transition" },
	{ url: "test_transition-animations-extended4.html", tags: "transition" },
	{ url: "test_transition-animations-extended5.html", tags: "transition" },
	{ url: "test_transition-animations-standard.html", tags: "transition" },
	{ url: "test_transition-animations.html", tags: "transition" },
	{ url: "test_transition-animations2.html", tags: "transition" },
	{ url: "test_transition-connect.html", tags: "transition" },
	{ url: "test_transition-pubsub.html", tags: "transition" }
];
