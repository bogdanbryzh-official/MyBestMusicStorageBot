;(() => {
  const searchField = document.getElementById('search')
  const goBtn = document.getElementById('btn')
  const results = document.getElementById('results')
  const header = document.getElementsByTagName('header')[0]

  const search = async searchData => {
    const url = `//${location.host}/search?query=${searchData}`
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  const renderTracks = tracks => {
    header.classList.remove('header_center')
    header.classList.add('header_top')
    results.innerHTML = ''
    tracks.forEach(track => {
      const { cover, title, artist, album, release_date, link } = track
      results.innerHTML += `
      <a href="${link}" target="_blank" rel="noopener noreferrer">
      <div class="track">
        <div class="cover" style="background-image: url('${cover}')"></div>
        <div class="info">
          <p class="title">${title}</p>
          <p class="artist">${artist}</p>
          <p class="album">${album}</p>
          <p class="year">${release_date}</p>
        </div>
      </div></a>`
    })
  }

  const goSearch = () => {
    const searchQuery = searchField.value
    if (searchQuery != '') {
      search(searchQuery).then(data => {
        renderTracks(data.data)
      })
    } else {
      iziToast.warning({
        title: 'Whoops',
        message: 'You forgot to fill search field',
      })
    }
  }

  goBtn.addEventListener('click', goSearch)
})()
