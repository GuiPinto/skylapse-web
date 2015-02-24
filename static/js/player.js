$(function() {

	var blocks = [];
	var prevSlot = 0;
	for (var id in window.videos) {
		var video = window.videos[id];
		blocks.push({
			id: 'v' + id,
			type: 'video',
			src: [
				'https://skylapse.s3.amazonaws.com/videos/'+video.uid+'/'+video.id+'.mp4',
				'https://skylapse.s3.amazonaws.com/videos/'+video.uid+'/'+video.id+'.mp4'
			],
			slot: [prevSlot, prevSlot + 30]
		});
		prevSlot += 30;
	}
	console.log(blocks);

	var duration = prevSlot + 30;
	var position = parseInt(duration / 4);
	var activeBlock = null; // init null
	var activeBlockIndex = null;
	var preBufferInterval = 5;
	var startedPreBuffering = false;
	var changingPosition = false;
	var startAtPosition = 0;
	var buffering = true;
	
	var progressEl = $("#progress");
	

	function tick() {
		if (position >= duration) return;
		
		
		if (buffering === true && activeBlock !== null) {
			console.log('SKIPPING BECAUSE OF bufferPaused');
			return;
		}

		console.log('tick -- position', position, '/', duration, 'buffering:', buffering);

		var currentBlockIndex = getCurrentBlockIndex(blocks, position);

		if (currentBlockIndex !== null &&
			activeBlockIndex !== currentBlockIndex) {

			var currentBlock = blocks[currentBlockIndex];

			// present new current block
			presentBlock(currentBlock);

			if (activeBlock !== null) {
				// Close active block
				hideBlock(activeBlock);
			}

			activeBlockIndex = currentBlockIndex;
			activeBlock = currentBlock;

			startedPreBuffering = false;
			
			buffering = true;

		}

		var timeLeft = getTimeLeft(activeBlock, position);

		if (!startedPreBuffering &&
			getTimeLeft(activeBlock, position) <= preBufferInterval &&
			activeBlockIndex < (blocks.length - 1)
		) {
			startedPreBuffering = true;

			var nextBlock = blocks[parseInt(activeBlockIndex + 1)];
			preloadBlock(nextBlock);
		}

		if (!changingPosition)
			progressEl.val(position);


		// Continue...
		position++;
	};
	setInterval(tick, 1000);

	function changePosition(newPosition) {
		newPosition = newPosition + 0;
		
		var blockAtPositionIndex = getCurrentBlockIndex(blocks, newPosition);
		
		var block = blocks[blockAtPositionIndex];
		
		startAtPosition = newPosition - block.slot[0];
		
		if ($(".wrap #" + block.id)[0].currentTime)
			$(".wrap #" + block.id)[0].currentTime = startAtPosition;
		
		position = parseInt(newPosition);
		
		changingPosition = false;
	
	}


	function presentBlock(block) {
		console.log('present blockId:', block.id);
		
		var blockObj = $(".wrap #" + block.id);
		blockObj.removeClass('hidden');
		$(".wrap .video").not(blockObj).addClass('hidden');
		
		var player = $(".wrap #" + block.id)[0];
		
		player.addEventListener("playing", function () {
			if (activeBlock.id != block.id) { 
				console.log('canceling video event because im not active block! i am ', block.id);
				return;
			}
			
			console.log('--playing--currentTime:', $(this)[0].currentTime);
			buffering = false;
			
			// Adjust position (!?)
			var cTime = $(this)[0].currentTime;
			var sTime = block.slot[0];
			position = parseInt(cTime + sTime);
			
		}, false);
		
		player.addEventListener("waiting", function () {
			if (activeBlock.id != block.id) { 
				console.log('canceling video event because im not active block! i am ', block.id);
				return;
			}
			console.log('--waiting--currentTime:', $(this)[0].currentTime);
			buffering = true;
		}, false);
		
		player.addEventListener("loadedmetadata", function () {
			if (activeBlock.id != block.id) { 
				console.log('canceling video event because im not active block! i am ', block.id);
				return;
			}
			console.log('--loadedmetadata--', $(this)[0].currentTime);
			player.currentTime = startAtPosition;
		}, false);
		
		player.play();
	
	}

	function hideBlock(block) {
		console.log('hide blockId:', block.id);
		$(".wrap #" + block.id).addClass('hidden');
		$(".wrap #" + block.id)[0].pause();
	}

	function preloadBlock(block) {
		console.log('preload blockId:', block.id);

		$(".wrap #" + block.id)[0].play();
		$(".wrap #" + block.id)[0].pause();
	}

	function getCurrentBlockIndex(blocks, position) {
		var currentBlock = null;
		for (var blockIndex in blocks) {
			if (blocks[blockIndex].slot &&
				blocks[blockIndex].slot.length == 2) {

				var blockSlots = blocks[blockIndex].slot;

				if (
					position >= blockSlots[0] &&
					position <= blockSlots[1]
				) {
					return parseInt(blockIndex);
				}
			}
		}
		console.log('No Block found for position:', position);
		return currentBlock;
	}

	function getTimeLeft(block, position) {
		var timeLeft = null;
		if (block.slot && block.slot.length == 2) {
			timeLeft = block.slot[1] - position;
		}
		return timeLeft;
	}
	
	
	$(".stacked-mode").click(function(){
 		if ($(this).is(':checked')) {
			$(".wrap").addClass("stacked");
		} else {
			$(".wrap").removeClass("stacked");
		}
	});
	
			
	progressEl.noUiSlider({
		start: 0,
		connect: "lower",
		behaviour: 'snap',
		orientation: "horizontal",
		animate: true,
		range: {
			'min': 0,
			'max': duration
		}
	});
	
	progressEl.on({
		slide: function(){
			changingPosition = true;
			//buffering = true;
		},
		set: function(){
		},
		change: function() {
			changePosition($(this).val());
		}
	});

	
	
});