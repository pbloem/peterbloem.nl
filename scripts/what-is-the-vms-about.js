$( document ).ready(function() 
{
 
	$("table.expandable").find("tr:gt(5)").addClass("hidable")
	
	$("table.expandable").addClass("closed")

	$("table.expandable")
		.append(
			$('<caption></caption>').addClass('open-link')
				.append($('<a></a>').attr('href','#')
					.text('more...')
					.click(function(){
						$(this).closest('table').removeClass("closed")
						$(this).closest('table').addClass("open")
						return false;
					})))
		.append(
			$('<caption></caption>').addClass('close-link')
				.append($('<a></a>').attr('href','#')
					.text('less...')
					.click(function(){
						$(this).closest('table').removeClass("open")
						$(this).closest('table').addClass("closed")
						return false;
					})))					
					
		
		
});