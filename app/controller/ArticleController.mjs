import Article from "../models/mongo/Article.mjs";

const ArticleController = {
  async index(req, res) {
    try {
      let skip = 0;
      let limit = 15;
      const page = req.query.page ? req.query.page : 1;
      skip = page === 1 ? 0 : (page - 1) * 15;
      let articles = Article.find({})
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);
      articles = await articles;
      const totalArticle = await Article.count();
      let totalPage = totalArticle / 15;
      const result = {
        total_page:
          totalPage > parseInt(totalPage)
            ? parseInt(totalPage) + 1
            : parseInt(totalPage),
        total: totalArticle,
        last_page: parseInt(page),
        data: articles,
      };

      return res.send({
        status: true,
        data: result,
      });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async store(req, res) {
    try {
      const admin = req.body.admin ? JSON.parse(req.body.admin) : null;
      const meta = req.body.meta ? JSON.parse(req.body.meta) : null;
      const cover = req.file;

      const articles = await new Article({
        title: req.body.title,
        cover: req.file ? cover.filename : null,
        content: req.body.content,
        admin: admin,
        published_at: req.body.published_at,
        meta: meta,
      });
      articles.save();

      return res.send({
        status: true,
        message: "Article has created",
      });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async show(req, res) {
    try {
      const articleId = req.params.id;
      const result = await Article.findById(articleId);
      if (!result)
        return res.status(404).send({
          status: false,
          message: "Article not found",
        });

      return res.send({
        status: true,
        data: result,
      });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const articleId = req.params.id;
      const article = await Article.findById(articleId);
      if (!article)
        return res.status(404).send({
          status: false,
          message: "Article not found",
        });

      const admin = req.body.admin ? JSON.parse(req.body.admin) : null;
      const meta = req.body.meta ? JSON.parse(req.body.meta) : null;
      const cover = req.file;
      const params = {
        title: req.body.title,
        cover: req.file ? cover.filename : null,
        content: req.body.content,
        admin: admin,
        published_at: req.body.published_at,
        meta: meta,
      };

      const result = await Article.updateOne(
        { _id: articleId },
        { $set: params }
      );

      if (result)
        return res.send({
          status: true,
          message: "Article has updated",
        });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },

  async destroy(req, res) {
    try {
      const articleId = req.params.id;
      const article = await Article.findById(articleId);
      if (!article)
        return res.status(404).send({
          status: false,
          message: "Article not found",
        });
      const result = await Article.deleteOne({ _id: articleId });
      if (result)
        return res.send({
          status: true,
          message: "Article has deleted",
        });
    } catch (error) {
      return res.send({
        status: false,
        message: error.message,
      });
    }
  },
};

export default ArticleController;
