$(document).ready(function () {
  var showHeaderAt = 150;

  var win = $(window),
    body = $("body");

  // Show the fixed header only on larger screen devices

  if (win.width() > 400) {
    // When we scroll more than 150px down, we set the
    // "fixed" class on the body element.

    win.on("scroll", function (e) {
      if (win.scrollTop() > showHeaderAt) {
        body.addClass("fixed");
      } else {
        body.removeClass("fixed");
      }
    });
  }
});
(function () {

  dev.Header = (function(){
    const selectors ={
      headerElement : '.header-fixed',
      headerTransparent : '.header-transparent',
      headerMobileNavigation: '.Header__menu--mobile',
      toggleMobileNavigation: '.Header__menu--mobile-trigger',
      mobileMenuToggle: "[data-toggle='mobile-menu']",
      mobileMenuDrawer: ".Drawer.Header__mobile-drawer",
      mobileMenuClose: "[data-mobile-nav-close]",
      mobileMenuActive: "Header__mobile-menu--active",
    }
    function Header(){
      this.header = document.querySelector(selectors.headerElement);
      this.headerHeight = this.header.offsetHeight;
      this.init();
    }
    Header.prototype = Object.assign({}, Header.prototype, {
      init: function () {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.header.querySelector(selectors.mobileMenuToggle).addEventListener('click', this.toggleMobileMenu.bind(this));
        this.header.querySelector(selectors.mobileMenuClose).addEventListener('click', this.toggleMobileMenu.bind(this));
      },
      handleScroll: function (e) {
        this.pageY = window.pageYOffset;
        this.pageY > this.headerHeight ? this.header.classList.add('header-transparent') : this.header.classList.remove('header-transparent');
      },
      toggleMobileMenu: function () {
        this.header.classList.toggle(selectors.mobileMenuActive);
        document.querySelector("body").classList.toggle("Drawer--open");
        this.header.querySelector(selectors.mobileMenuDrawer).classList.toggle("active")
      }
    });

    return Header;
  })();
  new dev.Header();
  // Hero Slider
  dev.sliderComponent = (function () {
    const selectors = {
      sliderElement: ".Hero__slider-flickity",
      addUpsell: "[data-upsell-add]",
    };

    function sliderComponent(container) {
      console.log("Here");
      this.sliderElements = document.querySelectorAll(selectors.sliderElement);
      this.sliderList = [];
      console.log(this.sliderList);
      this.status = { loading: false };
      this.init();
    }

    sliderComponent.prototype = Object.assign({}, sliderComponent.prototype, {
      init: function () {
        let _this = this;
        console.log("Initializing sliders",this)
        this.sliderElements.forEach(function (sliderElement) {
          let slider = new Flickity(sliderElement, {
            cellAlign: "center",
            wrapAround: true,
            // autoPlay: true,
            prevNextButtons: false
          });
          _this.sliderList.push(slider);
        });
      },
      addToCart: function (e) {
        this.addToCart = e.target;
        console.log("Add To Cart Upsell", e);
        let item = {
          id: Number(e.target.getAttribute("data-variant-id")),
          quantity: 1,
        };
        if (!item.id || !item.quantity) return;
        this.addItemFromForm(e, item);
      },
      addItemFromForm: function (evt, item) {
        evt.preventDefault();

        if (this.status.loading) return;

        // Loading indicator on add to cart button

        this.addToCart.classList.add("btn--loading");

        this.status.loading = true;

        fetch(dev.routes.cartAdd, {
          method: "POST",
          body: JSON.stringify(item),
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        })
          .then((response) => response.json())
          .then(
            function (data) {
              if (data.status === 422) {
                this.error(data);
              } else if (data.status >= 400) {
                this.error(data);
              } else {
                var product = data;
                this.success(product);
              }

              this.status.loading = false;
              this.addToCart.classList.remove("btn--loading");

              // Reload page if adding product from a section on the cart page
              if (document.body.classList.contains("template-cart")) {
                window.scrollTo(0, 0);
                location.reload();
              }
            }.bind(this)
          );
      },

      success: function (product) {
        document.dispatchEvent(
          new CustomEvent("ajaxProduct:added", {
            detail: {
              product: product,
              addToCartBtn: this.addToCart,
            },
          })
        );

        if (this.args && this.args.scopedEventId) {
          document.dispatchEvent(
            new CustomEvent("ajaxProduct:added:" + this.args.scopedEventId, {
              detail: {
                product: product,
                addToCartBtn: this.addToCart,
              },
            })
          );
        }
      },

      error: function (error) {
        console.error(error.description);

        document.dispatchEvent(
          new CustomEvent("ajaxProduct:error", {
            detail: {
              errorMessage: error.description,
            },
          })
        );

        if (this.args && this.args.scopedEventId) {
          document.dispatchEvent(
            new CustomEvent("ajaxProduct:error:" + this.args.scopedEventId, {
              detail: {
                errorMessage: error.description,
              },
            })
          );
        }
      },
    });

    return sliderComponent;
  })();
  if (dev.settings.initSliders) {
    new dev.sliderComponent();
  }
})();
